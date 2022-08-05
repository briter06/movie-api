import { EnvironmentService } from "@config/env/environment.service";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import * as jwt from 'jsonwebtoken';

@provide(TYPE.AuthService)
export class AuthService{

    constructor(
        @inject(TYPE.EnvironmentService) private environService: EnvironmentService
    ){}

    public login(username: string, password: string): any {
        const token = this.createToken(username);
        return token;
    }

    private createToken(userId: string){
        const accessToken = jwt.sign({
            id:userId,
        }, this.environService.getVariables().jwtSecret);
        return accessToken;
    }

}