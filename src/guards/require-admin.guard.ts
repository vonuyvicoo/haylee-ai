import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UserSession } from "@thallesp/nestjs-better-auth";

export class RequireAdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const session = request.session as UserSession;
        if(session.user.role !== 'admin') return false;

        return true;
    }
}
