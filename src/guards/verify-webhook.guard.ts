import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class VerifyWebhookGuard implements CanActivate {
    canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest();

        const token = request.query["hub.verify_token"];
        
        console.log(token);
        if(token == process.env.META_WEBHOOK_TOKEN){
            return true;
        }
        return false;
    }
}

