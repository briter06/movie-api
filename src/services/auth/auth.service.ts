import { EnvironmentService } from "@config/env/environment.service";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { IncorrectLoginError } from "@errors/incorrectLogin.error";
import { UserExistsError } from "@errors/userExists.error";
import { UserNoExistsError } from "@errors/userNoExists.error";
import { User } from "@models/User";
import { Params } from "@schemas/Params";
import { PersistanceService } from "@services/persistance/persistance.service";
import { getHashPassword, validateHashPassword } from "@utils/hash.crypto";
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
        const record = await this.persistanceService.getByKey(['password'],{
            PK: `USER#${username}`,
            SK: `USER#${username}`,
        });
        if(record){
            if(validateHashPassword(password,record.password)){
                const token = this.createToken(username,params.jwtExpirationTime);
                return token;
            }else{
                throw new IncorrectLoginError('Incorrect login');
            }
        }else{
            throw new UserNoExistsError('User does not exist');
        }
    }

    public async signup(user:User){
        const userExists = await this.persistanceService.getByKey(['PK','SK'],{
            PK: `USER#${user.username}`,
            SK: `USER#${user.username}`
        });
        if(userExists){
            throw new UserExistsError('Username already exists');
        }else{
            const result = await this.persistanceService.createItem({
                PK: `USER#${user.username}`,
                SK: `USER#${user.username}`
            },{
                password: getHashPassword(user.password!),
                name: user.name
            });
            return result
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
        const record = await this.persistanceService.getByKey(['PK', 'name'],{
            PK: `USER#${username}`,
            SK: `USER#${username}`,
        });
        if(record){
            return {
                username,
                name: record.name
            }
        }else{
            throw new UserNoExistsError('User does not exist');
        }
    }

}