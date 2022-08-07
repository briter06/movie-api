import * as express from "express";
import { interfaces, controller, httpGet, request, response, next } from "inversify-express-utils";
import { joiQueryValidator } from "@middlewares/joi/joi.middleware";
import Joi from "joi";
import { inject } from "inversify";
import { TYPE } from "@config/ioc/types";
import { RandomService } from "@services/random/random.service";
import { joiStringInteger } from "@utils/joi.utils";

@controller("/random")
export class RandomController implements interfaces.Controller {

    constructor(
        @inject(TYPE.RandomService) private randomService: RandomService
    ) {}

    @httpGet("/", joiQueryValidator(
        Joi.object().keys({
            min: joiStringInteger().optional(),
            max: joiStringInteger().optional()
        })
    ))
    public async getRandomNumber(@request() req: express.Request, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const result = await this.randomService.getRandomNumber(req.query);
        return {
            data: {
                number: result
            }
        };
    }
}