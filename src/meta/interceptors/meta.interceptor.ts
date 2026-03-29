import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from "@nestjs/common";
import { Observable } from "rxjs";
import { MetaRequestContext } from "./meta.context";

@Injectable({ scope: Scope.REQUEST })
export class MetaRequestInterceptor implements NestInterceptor {
    constructor(
        private readonly ctx: MetaRequestContext
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const integration_id: string | undefined = req.query.integration_id;
        this.ctx.setIntegration(integration_id);

        return next.handle();
    }
}
