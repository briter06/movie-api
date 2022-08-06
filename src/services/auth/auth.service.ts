import { EnvironmentService } from "@config/env/environment.service";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { UserExistsError } from "@errors/userExists.error";
import { User } from "@models/User";
import { Params } from "@schemas/Params";
import { PersistanceService } from "@services/persistance/persistance.service";
import { inject } from "inversify";
import * as jwt from 'jsonwebtoken';

@provide(TYPE.AuthService)
export class AuthService{

    constructor(
        @inject(TYPE.EnvironmentService) private environService: EnvironmentService,
        @inject(TYPE.PersistanceService) private persistanceService: PersistanceService
    ){}

    public async login(username: string, password: string): Promise<any> {
        const params: Params = await this.persistanceService.getParams();
        const user = await this.persistanceService.getUser(username, password);
        const token = this.createToken(user.username,params.jwtExpirationTime);
        return token;
    }

    public async signup(user:User){
        const exists = await this.persistanceService.userExists(user.username);
        if(!exists){
            const result = await this.persistanceService.createUser(user);
            return result
        }else{
            throw new UserExistsError('Username already exists');
        }
    }

    private createToken(userId: string, expiresIn?: string){
        const accessToken = jwt.sign({
            id:userId,
        }, this.environService.getVariables().jwtSecret,{expiresIn});
        return accessToken;
    }

    public async validateToken(token: string){
        const userInfo: any = jwt.verify(token, this.environService.getVariables().jwtSecret);
        const user = await this.me(userInfo.id);
        return user;
    }

    public async me(username: string): Promise<User>{
        return this.persistanceService.getUser(username);
    }

}