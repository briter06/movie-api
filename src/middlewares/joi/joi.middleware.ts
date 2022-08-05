import { RequestSchemaError } from "@errors/requestScheme.error";
import * as express from "express";
import Joi from "joi";

export const joiValidator = (joiScheme: Joi.ObjectSchema) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        const validationResult = joiScheme.validate(req.body);
        if(validationResult.error){
            throw new RequestSchemaError(`${req.url} - ${validationResult.error.message}`);
        }else{
            next();
        }
    }
}