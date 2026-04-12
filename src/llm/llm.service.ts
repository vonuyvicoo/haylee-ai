import {  Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { createAgent, createMiddleware, ReactAgent, ToolMessage } from 'langchain';
import { ChatDeepSeek} from "@langchain/deepseek";
import { IHistoryPayload, IRole } from '../message/dto/create-message.dto';
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { LLMFactory } from './factory/llm.factory';
import { HayleeToolFactory } from './tools/factory';
import { UserSession } from '@thallesp/nestjs-better-auth';
import { MAIN_PROMPT } from './prompts/main.prompt';

function serializeToolError(error: unknown): string {
    // for fb purposes
    if (!(error instanceof Error)) return String(error);
    const parts: string[] = [error.message];
    const e = error as unknown as Record<string, unknown>;
    if (e['response'] != null) {
        parts.push(JSON.stringify(e['response'], null, 2));
    }
    return parts.join('\n');
}

export const BANNED_WORDS = [
    "<script",
    "script>",
    "onclick",
    "onload",
    "button",
    ".js"
]

@Injectable()
export class LlmService implements OnModuleInit {
    private readonly logger = new Logger(LlmService.name, { timestamp: true })
    //agents
    private agent: ReactAgent;
    
    private model: ChatDeepSeek;

    private isInitialized: boolean = false;
    
    constructor(
        private readonly hayleeToolFactory: HayleeToolFactory,
        private readonly legacyLLMProvider: LLMFactory 
    ) {
        this.model = this.legacyLLMProvider.createMainLLM();
    }

    async onModuleInit() {
        await this.initialize();
    }

    private createDirectTools() {
        const tools = this.hayleeToolFactory.getTools();
        return Object.keys(tools).map((key) => {
            if(key === 'create_image') {
                return tools[key].getStructuredTool(this.model);
            }
            return tools[key].getStructuredTool();
        })
    }

    private async initialize() {
        if (!this.isInitialized) {
            const mcpTools = this.createDirectTools();
            const handleToolErrors = createMiddleware({
                name: "HandleToolErrors",
                wrapToolCall: async (request, handler) => {
                    try {
                        return await handler(request);
                    } catch (error) {
                        console.error('[LLM] Tool error:', error);
                        return new ToolMessage({
                            content: `Tool error: ${serializeToolError(error)}`,
                            tool_call_id: request.toolCall.id!,
                            status: 'error',
                        });
                    }
                },
            });

            this.agent = createAgent({
                model: this.model,
                tools: [...mcpTools],
                systemPrompt: MAIN_PROMPT,
                middleware: [
                    handleToolErrors
                ]
            });
            this.isInitialized = true;
        }
    }

    private convertToLangChainMessages(history: IHistoryPayload[]) {
        return history.map(msg => {
            if (msg.role === IRole.HUMAN) {
                return new HumanMessage(msg.content);
            }

            return new AIMessage({
                content: msg.content || "",
            });
        });
    }

    async *invoke(messages: IHistoryPayload[], session: UserSession, signal: AbortSignal) {
        try {
            await this.initialize();
            const langchainMessages = this.convertToLangChainMessages(messages);

            for await (const [mode, chunk] of await this.agent.stream(
                {
                    messages: langchainMessages,
                }, 
                { 
                    signal,
                    streamMode: ["messages", "custom", "updates", "tools"], 
                    recursionLimit: 50,
                    configurable: {
                        session
                    }
                }
            )) {
                if(mode === 'updates') {
                }
                yield [mode, chunk] as const;
            }

        } catch (error) {
            console.error('[LLM] Error during invoke:', error);
        }
    }
}
