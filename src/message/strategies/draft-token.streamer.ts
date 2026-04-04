import { Subscriber } from "rxjs";
import { DraftTokenPayload, EventKind, LlmTokenChunk, LlmTokenPayload, StreamEvent } from "../interfaces/stream-response.interface";
import { IStreamer } from "../interfaces/streamer.interface";

const NODE_WHITELIST = ["draftLLMCall"]

export class DraftTokenStreamer implements IStreamer {
    emit(event: LlmTokenChunk, subscriber: Subscriber<StreamEvent>): void {
    try {
        const [_, chunk] = event;
        const [messageChunk, _metadata_] = chunk;

        if(!NODE_WHITELIST.includes(_metadata_.langgraph_node)) return;

        subscriber.next(new MessageEvent<DraftTokenPayload>("json", {
            data: {
                kind: EventKind.DRAFT_TOKEN,
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

/*

export class SearchStreamer implements IStreamer {
    emit(event: LlmTokenChunk, subscriber: Subscriber<StreamEvent>): void {
        const [_, chunk] = event;
        const chunkData = chunk as unknown as SearchPayload;
        subscriber.next(new MessageEvent<SearchPayload>("json", {
            data: {
                kind: chunkData.kind,
                content: chunkData.content,
                search_call_id: chunkData.search_call_id,
                status: chunkData.status,
                results: chunkData.results,
                node: chunkData.node,
            }
        }));
    }
}
*/
