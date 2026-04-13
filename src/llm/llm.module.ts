import { Module, Provider } from "@nestjs/common"
import { MAIN_LLM_TOKEN } from "src/_shared/constants"
import { LLMFactory } from "./llm.factory"

export const LLMProvider: Provider = {
    provide: MAIN_LLM_TOKEN,
    useFactory: (factory: LLMFactory) => {
        return factory.createMainLLM() 
    },
    inject: [LLMFactory]
}

@Module({
    providers: [LLMFactory, LLMProvider],
    exports: [MAIN_LLM_TOKEN]
})
export class LlmModule {}
