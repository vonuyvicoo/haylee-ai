import { Subscriber } from "rxjs";
import { LlmTokenChunk, LogInfoPayload, StreamEvent } from "../interfaces/stream-response.interface";
import { IStreamer } from "../interfaces/streamer.interface";

export class LogInfoStreamer implements IStreamer {
    emit(event: LlmTokenChunk, subscriber: Subscriber<StreamEvent>): void {
        const [_, chunk] = event;
        const chunkData = chunk as unknown as LogInfoPayload;
        subscriber.next(new MessageEvent<LogInfoPayload>("json", {
            data: {
                kind: chunkData.kind,
                content: chunkData.content,
                node: chunkData.node,
            }
        }));
    }
}
