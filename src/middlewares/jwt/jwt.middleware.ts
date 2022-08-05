import { BaseMiddleware } from "inversify-express-utils";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import * as express from "express";
import { ForbiddenError } from "@errors/forbidden.error";
import { AuthService } from "@services/auth/auth.service";
import { ApiRequest } from "@schemas/ApiRequest";

@provide(TYPE.JwtMiddleware)
export class JwtMiddleware extends BaseMiddleware {

    constructor(
        @inject(TYPE.AuthService) private authService: AuthService
    ){
        super();
    }

    public handler(
        req: ApiRequest,
        res: express.Response,
        next: express.NextFunction
    ) {
        const authHeader = req.headers.authorization;
        if(authHeader){
            const token = authHeader.split(' ')[1];
            this.authService.validateToken(token)
            .then((result)=>{
                req.user = result;
                next();
            }).catch((err)=>{
                next(new ForbiddenError('Forbidden resource'));
            })
        }else{
            throw new ForbiddenError('Forbidden resource');
        }
    }
}