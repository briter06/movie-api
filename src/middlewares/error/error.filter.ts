import { InternalServerError } from "@errors/internalServer.error";
import { RequestSchemaError } from "@errors/requestScheme.error";
import * as express from "express";

export const errorFilter = (err: Error,req: express.Request, res: express.Response, next: express.NextFunction)=>{
    if (err) {
        if(err instanceof RequestSchemaError){
            return res.status(err.getStatus()).json(err.getResponse());
        }
        const genericError = new InternalServerError(err.message);
        return res.status(genericError.getStatus()).json(genericError.getResponse());
    }
    next();
}