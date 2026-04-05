import { Subscriber } from "rxjs";
import { EventKind, LlmTokenChunk, LlmTokenPayload, StreamEvent, ToolPayload, ToolStatus } from "../interfaces/stream-response.interface";
import { IStreamer } from "../interfaces/streamer.interface";
import { ToolMessage } from "langchain";

export type ToolStreamEventData =
  | {
      event: "on_tool_start";
      toolCallId?: string;
      name: string;
      input: unknown;
    }
  | {
      event: "on_tool_event";
      toolCallId?: string;
      name: string;
      data: unknown;
    }
  | {
      event: "on_tool_end";
      toolCallId?: string;
      name: string;
      output: ToolMessage;
    }
  | {
      event: "on_tool_error";
      toolCallId?: string;
      name: string;
      error: unknown;
    };
// langgraph doesnt export this type

const NODE_WHITELIST = ["tools"];

export function parseToolChunk(msg: ToolMessage) {
    const output = msg.content;
    try {
        const parsed = JSON.parse(output as string);
        const out = {
            type: "json",
            content: parsed
        }
        return out;
    } catch (err) {
        const out= {
            type: "text",
            content: output
        }

        return out;
    }
}

export class ToolStreamer implements IStreamer {
    emit(event: LlmTokenChunk, subscriber: Subscriber<StreamEvent>): void {
    try {
        const [_, chunk] = event;
        const toolChunk = (chunk as unknown as ToolStreamEventData);

            switch (toolChunk.event) {
                case 'on_tool_start': {
                    subscriber.next(new MessageEvent<ToolPayload>("json", {
                        data: {
                            kind: EventKind.TOOLS,
                            node: "tools",
                            name: toolChunk.name,
                            status: ToolStatus.START,
                            tool_call_id: toolChunk.toolCallId,
                            content: {
                                params: toolChunk.input
                            },
                            results: []
                        }
                    }));

                    // THIS IS JUST FOR ADJUSTING THE FORMATTING IN THE UI.
                    subscriber.next(new MessageEvent<LlmTokenPayload>("json", {
                        data: {
                            kind: EventKind.LLM_TOKEN,
                            node: "model_request",
                            content: [{ type: "text", text: "\n\n" }],
                            model: "claude-opus-max",
                            is_tool_output: false,
                        }
                    }));

                    break;
                }
                case 'on_tool_end': {
                    subscriber.next(new MessageEvent<ToolPayload>("json", {
                        data: {
                            kind: EventKind.TOOLS,
                            node: "tools",
                            name: toolChunk.name,
                            status: ToolStatus.END,
                            tool_call_id: toolChunk.toolCallId,
                            results: [
                                { ...parseToolChunk(toolChunk.output) }
                            ]
                        }
                    }));

                    break;

                }
            }
        } catch (err){ 
            console.error(err)
        } 
    }
}
