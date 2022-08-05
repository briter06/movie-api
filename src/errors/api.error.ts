import { ApiErrors } from "@enums/errors.enum";
import { LoggerService } from "@services/logger/logger.service";

export class ApiError extends Error{

    private errorId: ApiErrors;
    private statusCode: number;

    constructor(
        msg: string,
        errorId: ApiErrors,
        statusCode: number
    ) {
        super(msg);
        this.errorId = errorId;
        this.statusCode = statusCode;
    }

    log(logger: LoggerService){
        logger.error(`${this.errorId} - ${this.message}`);
    }

    getStatus(){
        return this.statusCode;
    }

    getResponse(){
        return {
            data: {},
            error: this.errorId
        }
    }
}