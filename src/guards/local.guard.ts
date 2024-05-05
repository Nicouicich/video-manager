import { ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

export class LocalGuard extends AuthGuard('local') {
    canActivate(context: ExecutionContext):
        boolean | Promise<boolean> | Observable<boolean> {
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        context.switchToHttp().getRequest().user = user;
        return super.handleRequest(err, user, info, context);
    }
}