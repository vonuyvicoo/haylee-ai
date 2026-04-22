import { Injectable, } from "@nestjs/common";
import { IStreamer } from "../interfaces/streamer.interface";
import { LlmTokenStreamer } from "../strategies/llm-token.streamer.strategy";
import { GraphStreamChunk } from "../interfaces/stream-response.interface";
import { ToolStreamer } from "../strategies/tool.streamer";
import { LogInfoStreamer } from "../strategies/log-info.streamer";

@Injectable()
export class StreamerFactory {
    private strategies: Record<string, IStreamer> = {
        "messages": new LlmTokenStreamer(),
        "tools": new ToolStreamer(),
        "log_info": new LogInfoStreamer(),
    }

    public create(event: GraphStreamChunk): IStreamer | null {
        // this is gonna be hard because langgraph orchestrates typing differently
        const [mode, chunk] = event;

        if(mode === 'messages') {
            const [_, chunk] = event;
            const [__, _metadata_] = chunk;
            if(_metadata_.langgraph_node === 'draftLLMCall') {
                return this.strategies['draft']
            }
            return this.strategies['messages'];
        } 
        if(mode === 'tools') {
            return this.strategies['tools'];
        }
        else if(mode ==='updates') {
            console.log(chunk);
        }

        return null;
    }
}
