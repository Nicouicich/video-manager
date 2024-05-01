import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    constructor (
        // private readonly jwtService: JwtService
    ) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = (await super.canActivate(context)) as boolean;
        await super.logIn(request);

        return user;
    }
}