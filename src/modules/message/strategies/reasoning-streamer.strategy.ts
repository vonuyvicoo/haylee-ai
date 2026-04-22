import { Subscriber } from "rxjs";
import { EventKind, LlmTokenChunk, ReasoningTokenPayload, StreamEvent } from "../interfaces/stream-response.interface";
import { IStreamer } from "../interfaces/streamer.interface";

export class ReasoningTokenStreamer implements IStreamer {
    emit(event: LlmTokenChunk, subscriber: Subscriber<StreamEvent>): void {
        const [_, chunk] = event;
        const [messageChunk, _metadata_] = chunk;

        subscriber.next(new MessageEvent<ReasoningTokenPayload>("json", {
            data: {
                kind: EventKind.REASONING_TOKEN,
                node: "model_request",
                // reasoning will leave here so allow in filter
                content: messageChunk.contentBlocks.filter(c => c.type === 'reasoning').map((c) => { return { type: c.type, text: c.reasoning ?? "" } }),
                model: "claude-opus-max",
                is_tool_output: false,
            }
        }));
    }
}
