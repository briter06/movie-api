import { EnvironmentService } from "@config/env/environment.service";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { User } from "@models/User";
import { Params } from "@schemas/Params";
import { inject } from "inversify";
import * as jwt from 'jsonwebtoken';

@provide(TYPE.PersistanceService)
export class PersistanceService{

    constructor(
        @inject(TYPE.EnvironmentService) private environService: EnvironmentService
    ){}

    public async getUser(username: string): Promise<User> {
        return {
            username: 'briter06',
            password: 'briter1234'
        }
    }

    public async getParams(): Promise<Params>{
        return {
            jwtExpirationTime: '30s'
        }
    }

}