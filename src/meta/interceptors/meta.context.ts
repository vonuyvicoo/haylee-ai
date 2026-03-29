import { Injectable, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.REQUEST })
export class MetaRequestContext {
    integrationId?: string;

    setIntegration(id?: string) {
        this.integrationId = id;
    }
}
