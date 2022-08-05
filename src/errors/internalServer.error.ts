import { ApiErrors } from "@enums/errors.enum";

export class InternalServerError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }

    getStatus(){
        return 500;
    }

    getResponse(){
        return {
            data: {},
            error: ApiErrors.INTERNAL_SERVER_ERROR
        }
    }
}