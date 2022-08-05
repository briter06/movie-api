import { InternalServerError } from "@errors/internalServer.error";
import { RequestSchemaError } from "@errors/requestScheme.error";
import { LoggerService } from "@services/logger/logger.service";
import * as express from "express";

export const errorFilter = (logger: LoggerService)=>{
    return (err: Error,req: express.Request, res: express.Response, next: express.NextFunction)=>{
        if (err) {
            if(err instanceof RequestSchemaError){
                err.log(logger);
                return res.status(err.getStatus()).json(err.getResponse());
            }
            const genericError = new InternalServerError(err.message);
            genericError.log(logger);
            return res.status(genericError.getStatus()).json(genericError.getResponse());
        }
        next();
    }
}