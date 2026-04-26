import { StructuredTool, tool } from "langchain";
import { RunnableConfig } from "@langchain/core/runnables";
import { ForbiddenException, Injectable, } from "@nestjs/common";
import { HayleeTool } from "@modules/agent/common";
import { EmailFactory } from "@modules/email/email.factory";
import { SendEmailParams, SendEmailSchema } from "@modules/email/interfaces";

@Injectable()
export class SendEmailTool extends HayleeTool {
    constructor(private emailFactory: EmailFactory){
        super();
    }

    getStructuredTool(): StructuredTool {
        
        return tool(
            async (params: SendEmailParams, config: RunnableConfig) => {
                const session = config.configurable?.session;
                if(!session) throw new ForbiddenException("No session");
                const client = await this.emailFactory.create(session);
                const res = await client.send(params);
                return JSON.stringify(res);
            },
            {
                name: 'send_email',
                description: "Used to send outbound emails",
                schema: SendEmailSchema 
            }
        );
    }
} 




