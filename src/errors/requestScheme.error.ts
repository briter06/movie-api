import { ApiErrors } from "@enums/errors.enum";

export class RequestSchemaError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, RequestSchemaError.prototype);
    }

    getStatus(){
        return 400;
    }

    getResponse(){
        return {
            data: {},
            error: ApiErrors.REQUEST_SCHEMA_ERROR
        }
    }
}