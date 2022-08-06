import * as express from "express";
import { interfaces, controller, request, response, next, httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPE } from "@config/ioc/types";
import { AuthService } from "@services/auth/auth.service";
import Joi from "joi";
import { joiBodyValidator } from "@middlewares/joi/joi.middleware";
import { InvalidEmailError } from "@errors/invalidEmail.error";

@controller("/auth")
export class AuthController implements interfaces.Controller {

    constructor(
        @inject(TYPE.AuthService) private authService: AuthService
    ) {}

    @httpPost("/login", joiBodyValidator(
        Joi.object().keys({
            username: Joi.string().required().email({ tlds: { allow: false } }).label('email'),
            password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#?\]]).{10,}$/).label('password')
        })
    ))
    public async login(@request() req: express.Request, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const token = await this.authService.login(req.body.username,req.body.password);
        return {
            data: {
                access_token: token
            }
        };
    }

    @httpPost("/signup", joiBodyValidator(
        Joi.object().keys({
            username: Joi.string().required().email({ tlds: { allow: false } }).label('email'),
            password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#?\]]).{10,}$/).label('password'),
            name: Joi.string().required()
        })
    ))
    public async signup(@request() req: express.Request, @response() res: express.Response, @next() nextf: express.NextFunction): Promise<any> {
        const result = await this.authService.signup({username: req.body.username, password: req.body.password, name: req.body.name});
        return {
            data: result
        };
    }
}