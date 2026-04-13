import { RunnableConfig } from "@langchain/core/runnables"

export type RunnableInvocationParams<T> = {
    params: T,
    config?: RunnableConfig
}

export interface IRunnableSubagent<T> {
    run(params: RunnableInvocationParams<T>): void;
}

