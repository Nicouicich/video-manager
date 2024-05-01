import { BadRequestException, CallHandler, Catch, ExecutionContext, NestInterceptor, NotFoundException } from "@nestjs/common";
import { EmailAlreadyExistsException, UsernameAlreadyExistsException } from "libs/errors/duplicated-user.error";
import { catchError, Observable } from "rxjs";

@Catch(UsernameAlreadyExistsException)
export class UsernameAlreadyExistsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(error => {
                if (error instanceof UsernameAlreadyExistsException) throw new BadRequestException(error.message);
                throw error;
            })
        );
    }
}

@Catch(EmailAlreadyExistsException)
export class EmailAlreadyExistsInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(error => {
                if (error instanceof EmailAlreadyExistsException) throw new BadRequestException(error.message);
                throw error;
            })
        );
    }
}