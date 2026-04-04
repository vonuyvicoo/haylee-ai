import { Subscriber } from "rxjs";
import { EventKind, LlmTokenChunk, LlmTokenPayload, StreamEvent } from "../interfaces/stream-response.interface";
import { IStreamer } from "../interfaces/streamer.interface";

const NODE_WHITELIST = ["basicLLMCall", "digestLLMCall", "legalAnalysisLLMCall", "model_request"];

export class LlmTokenStreamer implements IStreamer {
    emit(event: LlmTokenChunk, subscriber: Subscriber<StreamEvent>): void {
    try {
        const [_, chunk] = event;
        const [messageChunk, _metadata_] = chunk;

        if(!NODE_WHITELIST.includes(_metadata_.langgraph_node)) return;

        subscriber.next(new MessageEvent<LlmTokenPayload>("json", {
            data: {
                kind: EventKind.LLM_TOKEN,
                node: "model_request",
                content: messageChunk.contentBlocks.filter(c => c.type === 'text').map((c) => { return { type: c.type, text: c.text ?? "" } }),
                model: "claude-opus-max",
                is_tool_output: false,
            }
        }));
        } catch (err){ 
            console.error(err)
        } 
    }
}
