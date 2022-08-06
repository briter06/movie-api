import { JOI_ERROR } from "@enums/joiErrors.enum";
import { InvalidEmailError } from "@errors/invalidEmail.error";
import { InvalidPasswordError } from "@errors/invalidPassword.error";
import { RequestSchemaError } from "@errors/requestScheme.error";
import * as express from "express";
import Joi from "joi";

export const joiBodyValidator = (joiScheme: Joi.ObjectSchema) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        const validationResult = joiScheme.validate(req.body);
        if(validationResult.error){
            throw processCustomJoiErrors(req, validationResult.error, 'Body');
        }else{
            next();
        }
    }
}

export const joiQueryValidator = (joiScheme: Joi.ObjectSchema) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction)=>{
        const validationResult = joiScheme.validate(req.query);
        if(validationResult.error){
            throw processCustomJoiErrors(req, validationResult.error, 'Query');
        }else{
            next();
        }
    }
}

const processCustomJoiErrors = (req: express.Request,error: Joi.ValidationError, origin: string) => {
    const message = `${req.url} - ${error.message} - ${origin}`;
    if(error.details.length>0){
        const valErr = `${error.details[0].context?.label}#${error.details[0].type}`
        switch(valErr){
            case JOI_ERROR.INVALID_EMAIL:
                return new InvalidEmailError(message);
            case JOI_ERROR.INVALID_PASSWORD:
                return new InvalidPasswordError(message);
            default:
                return new RequestSchemaError(message);
        }
    }
    return new RequestSchemaError(message);
}