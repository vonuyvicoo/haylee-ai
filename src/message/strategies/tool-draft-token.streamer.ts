import { Subscriber } from "rxjs";
import { DraftTokenPayload, LlmTokenChunk, SearchPayload, StreamEvent } from "../interfaces/stream-response.interface";
import { IStreamer } from "../interfaces/streamer.interface";

export class ToolDraftStreamer implements IStreamer {
    emit(event: LlmTokenChunk, subscriber: Subscriber<StreamEvent>): void {
        const [_, chunk] = event;
        const chunkData = chunk as unknown as DraftTokenPayload;
        subscriber.next(new MessageEvent<DraftTokenPayload>("json", {
            data: {
                kind: chunkData.kind,
                content: chunkData.content,
                model: chunkData.model,
                is_tool_output: false,
                node: chunkData.node,
            }
        }));
    }
}
