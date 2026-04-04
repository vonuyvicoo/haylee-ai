import { Subscriber } from "rxjs";
import { LlmTokenChunk, SearchPayload, StreamEvent } from "../interfaces/stream-response.interface";
import { IStreamer } from "../interfaces/streamer.interface";

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
