import { ChatDeepSeek } from "@langchain/deepseek";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LLMFactory {
    createMainLLM() {
        return new ChatDeepSeek({
            model: "deepseek-chat",
            temperature: 1,
            maxConcurrency: 10,
            streaming: true,
        })
    }

}
