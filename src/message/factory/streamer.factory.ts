import { Injectable, } from "@nestjs/common";
import { IStreamer } from "../interfaces/streamer.interface";
import { LlmTokenStreamer } from "../strategies/llm-token.streamer.strategy";
import { CustomSchema, GraphStreamChunk } from "../interfaces/stream-response.interface";
import { SearchStreamer } from "../strategies/search-streamer.strategy";
import { DraftTokenStreamer } from "../strategies/draft-token.streamer";
import { ToolStreamer } from "../strategies/tool.streamer";
import { LogInfoStreamer } from "../strategies/log-info.streamer";
import { ToolDraftStreamer } from "../strategies/tool-draft-token.streamer";

@Injectable()
export class StreamerFactory {
    private strategies: Record<string, IStreamer> = {
        "messages": new LlmTokenStreamer(),
        "search": new SearchStreamer(),
        "draft": new DraftTokenStreamer(),
        "tools": new ToolStreamer(),
        "tool_draft": new ToolDraftStreamer(),
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
        else if(mode === 'custom') {
            if(chunk._schema === CustomSchema.SEARCH) {
                return this.strategies['search']
            } else if (chunk._schema === CustomSchema.LOG_INFO) {
                return this.strategies['log_info']
            } else if(chunk._schema === CustomSchema.TOOL_DRAFT) {
                return this.strategies['tool_draft']
            }
        }

        else if(mode ==='updates') {
            console.log(chunk);
        }

        return null;
    }
}
