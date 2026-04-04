import { AIMessageChunk, BaseMessageChunk } from "langchain";

export interface IAIMessageEvent {
    data: string;
    kind: string; // llm level
    type: "string" | "json"; // http level
}

export enum EventKind {
    LLM_TOKEN = "llm_token",
    REASONING_TOKEN = "reasoning_token",
    SEARCH_UPDATE = "search_update",
    DRAFT_TOKEN = "draft_token",
    TOOLS = "tools",
    ERROR = "error",
    LOG_INFO = "log_info",
}

interface BaseEventPayload {
    // main differentiator for Graph API
    kind: EventKind; 
    // langgraph node source
    node: string; 
}

export interface LlmTokenPayload extends BaseEventPayload {
    kind: EventKind.LLM_TOKEN;
    content: LlmContent[];
    model: string;
    is_tool_output: boolean;
}

interface LlmContent {
    type: "text";
    text: string;
}

interface DraftContent extends LlmContent {};

export interface DraftTokenPayload extends BaseEventPayload {
    _schema?: CustomSchema.TOOL_DRAFT,
    kind: EventKind.DRAFT_TOKEN;
    content: DraftContent[];
    model: string;
    is_tool_output: boolean;
}



export interface ReasoningTokenPayload extends BaseEventPayload {
    kind: EventKind.REASONING_TOKEN;
    content: ReasoningContent[];
    model: string;
    is_tool_output: boolean;
}

interface ReasoningContent {
    type: "reasoning";
    text: string;
}

export enum SearchStatus {
    PENDING = "PENDING",
    DONE = "DONE"
}

export enum ToolStatus {
    START = "START",
    END = "END",
    ERROR = "ERROR"
}

export interface SearchPayload extends BaseEventPayload {
    kind: EventKind.SEARCH_UPDATE;
    content: SearchContent;
    search_call_id: string;
    status: SearchStatus;
    results: MinimalSearchResultContent[];
}

export interface LogInfoPayload extends BaseEventPayload {
    kind: EventKind.LOG_INFO;
    content: LogInfoContent;
}
export type LogInfoContent = Record<string, any>;

interface SearchContent {
    query: string;
    search_type: WorkerType;
}

interface MinimalSearchResultContent {
    title: string;
    original_identifier_number: string;
    chunk_id: string;
    slug: string;
}

export interface ToolPayload extends BaseEventPayload {
    kind: EventKind.TOOLS;
    content?: ToolContent;
    name: string;
    tool_call_id?: string;
    status: ToolStatus;
    results: ToolResultContent[];
}

export interface ToolContent {
    params: unknown;
}

export interface ToolResultContent {
    type: string;
    content: any;
}

export interface ErrorPayload extends BaseEventPayload {
    kind: EventKind.ERROR;
    message: string;
}

// outward facing
export type StreamEvent = 
| MessageEvent<LlmTokenPayload>
| MessageEvent<ErrorPayload>
| MessageEvent<ReasoningTokenPayload>
| MessageEvent<SearchPayload>
| MessageEvent<DraftTokenPayload>
| MessageEvent<ToolPayload>
| MessageEvent<LogInfoPayload>

// langgraph
export type LlmTokenChunk = ["messages", [BaseMessageChunk, Record<string, any>]];
export type UpdateChunk = ["updates", { model_request: { messages: AIMessageChunk[]}}]
// langgraph union
export type GraphStreamChunk =
| LlmTokenChunk
| UpdateChunk
| ["values", Record<string, any>]
| ["custom", Record<string, any>]
| ["tools", Record<string, any>]



export enum CustomSchema {
    SEARCH = "SearchSchema",
    LOG_INFO = "LogInfoSchema",
    TOOL_DRAFT = "ToolDraftSchema"
}
