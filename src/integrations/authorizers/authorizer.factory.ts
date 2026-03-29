import { IntegrationType } from "prisma/generated/prisma";
import { IAuthorizerBase, IAuthorizerOauth } from "../interfaces";
import { MetaAuthorizer } from "./meta.authorizer";

export class AuthorizerFactory {
    private static strategies: Record<IntegrationType, IAuthorizerBase> = {
        [IntegrationType.META]: new MetaAuthorizer()
    }; 

    static create<T>(type: IntegrationType) {
        return AuthorizerFactory.strategies[type] as T;
    }
}
