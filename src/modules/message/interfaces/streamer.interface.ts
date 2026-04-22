import { GraphStreamChunk, StreamEvent } from "./stream-response.interface";
import { Subscriber } from "rxjs";

export interface IStreamer {
    emit(event: GraphStreamChunk, subscriber: Subscriber<StreamEvent>): void;
}
