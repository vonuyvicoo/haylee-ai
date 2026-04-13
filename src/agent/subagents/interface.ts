import { RunnableConfig } from "@langchain/core/runnables"

export type RunnableInvocationParams<T> = {
    params: T,
    config?: RunnableConfig
}

export enum RunnableSubagentType {
    SEARCH = "SEARCH"
}

export interface IRunnableSubagent<T> {
    name: RunnableSubagentType;
    run(params: RunnableInvocationParams<T>): Promise<void>;
}

export type SubagentMap = Record<RunnableSubagentType, IRunnableSubagent<unknown>>;
