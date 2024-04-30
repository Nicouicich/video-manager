import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        if (apiKey !== process.env.API_KEY) {
            throw new HttpException('Invalid API Key', HttpStatus.FORBIDDEN);
        }
        return true;
    }
}