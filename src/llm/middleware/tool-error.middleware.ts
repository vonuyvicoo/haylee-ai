import { createMiddleware, ToolMessage } from "langchain";

export function serializeToolError(error: unknown): string {
    if (!(error instanceof Error)) return String(error);
    const parts: string[] = [error.message];
    const e = error as unknown as Record<string, unknown>;
    if (e['response'] != null) {
        parts.push(JSON.stringify(e['response'], null, 2));
    }
    return parts.join('\n');
}

export const handleToolErrors = createMiddleware({
    name: "HandleToolErrors",
    wrapToolCall: async (request, handler) => {
        try {
            return await handler(request);
        } catch (error) {
            console.error('[LLM] Tool error:', error);
            return new ToolMessage({
                content: `Tool error: ${serializeToolError(error)}`,
                tool_call_id: request.toolCall.id!,
                status: 'error',
            });
        }
    },
});

