import { StructuredTool } from "langchain";

export abstract class HayleeTool {
    constructor(){}

    abstract getStructuredTool(model?: any): StructuredTool;
}
