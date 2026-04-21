import {  Inject, Injectable, InternalServerErrorException, Logger, OnModuleInit } from '@nestjs/common';
import { createAgent, ReactAgent, } from 'langchain';
import { HumanMessage, } from "@langchain/core/messages";
import { UserSession } from '@thallesp/nestjs-better-auth';
import { MAIN_PROMPT } from './prompts/main.prompt';
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { RunnableConfig } from '@langchain/core/runnables';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { HAYLEE_TOOL_TOKEN, MAIN_LLM_TOKEN } from 'src/_shared/constants';
import { HayleeTool } from './common';
import { handleToolErrors } from './middleware/tool-error.middleware';

export const BANNED_WORDS = [
    "<script",
    "script>",
    "onclick",
    "onload",
    "button",
    ".js"
]

@Injectable()
export class AgentService implements OnModuleInit {
    private readonly logger = new Logger(AgentService.name, { timestamp: true })
    //agents
    private agent: ReactAgent;
    private checkpointer: PostgresSaver;

    constructor(
        @Inject(HAYLEE_TOOL_TOKEN) private readonly tools: HayleeTool[],
        @Inject(MAIN_LLM_TOKEN) private readonly model: BaseChatModel
    ) {}

    async onModuleInit() {
        const dbUrl = process.env.DATABASE_URL;
        if(!dbUrl) throw new InternalServerErrorException("Can't start app. No DATABASE_URL provided.");
        this.checkpointer = PostgresSaver.fromConnString(dbUrl);
        if(process.env.INIT_CHECKPOINTER === "true") {
            await this.setupCheckpointer()
        } else {
            this.logger.log(`Skipping checkpointer setup. INIT_CHECKPOINTER is set to false`)
        }

        const agentTools = this.createDirectTools();
        this.logger.log(`Loaded ${agentTools.length} tools`)

        this.agent = createAgent({
            model: this.model,
            tools: [...agentTools],
            systemPrompt: MAIN_PROMPT,
            middleware: [
                handleToolErrors
            ],
            checkpointer: this.checkpointer
        });

    }

    private async setupCheckpointer() {
        this.logger.log('Setting up PostgresSaver');
        await this.checkpointer.setup();
        this.logger.log('Finished Postgres checkpointer setup.');
    }

    private createDirectTools() {
        const tools = this.tools;
        return Object.keys(tools).map((key) => {
            if(key === 'create_image') {
                return tools[key].getStructuredTool(this.model);
            }
            return tools[key].getStructuredTool();
        })
    }

    async *invoke(thread_id: string, message: string, session: UserSession, signal: AbortSignal) {
        console.log("THREAD ID: ", thread_id);
        try {
            for await (const [mode, chunk] of await this.agent.stream(
                { messages: new HumanMessage(message) }, 
                { 
                    signal,
                    streamMode: ["messages", "custom", "updates", "tools"], 
                    recursionLimit: 50,
                    configurable: {
                        session,
                        thread_id
                    }
                }
            )) {
                yield [mode, chunk] as const;
            }

        } catch (error) {
            console.error('[LLM] Error during invoke:', error);
        }
    }
    

    // internal DO NOT EXPOSE
    async _findManyMessages(thread_id: string) {
        const config: RunnableConfig = {
            configurable: {
                thread_id
            }
        };

        const tuple = await this.checkpointer.getTuple(config);
        const messages = tuple?.checkpoint?.channel_values?.messages ?? [];

        return messages;
    }
}
