import { TYPE } from "@config/ioc/types";
import { provide } from "@config/ioc/inversify.config";
import axios from "axios";
import { InternalServerError } from "@errors/internalServer.error";
import { inject } from "inversify";
import { EnvironmentService } from "@config/env/environment.service";
import { RandomApiStatus } from "@enums/randomApiStatus.enum";
import { LoggerService } from "@services/logger/logger.service";

@provide(TYPE.RandomService)
export class RandomService{

    constructor(
        @inject(TYPE.LoggerService) private loggerService: LoggerService,
        @inject(TYPE.EnvironmentService) private environService: EnvironmentService
    ) {}

    public async getRandomNumber(params: any): Promise<number>{
        try{
            const query = Object.keys(params).map(p=>`${p}=${params[p]}`).join('&');
            const url = `${this.environService.getVariables().randomApi}?${query}`;
            this.loggerService.debug(`Random API - Get request: ${url}`);
            const response = await axios.get(url);
            const result = response.data[0];
            if(result?.status){
                if(result.status === RandomApiStatus.SUCCESS){
                    this.loggerService.debug(`Random API - Response: ${JSON.stringify(result)}`);
                    return result.random;
                }else{
                    throw new InternalServerError(`Code ${result.code}: ${result.reason}`);
                }
            }
            throw new InternalServerError(`Response: ${JSON.stringify(response.data)}`);
        }catch(err: any){
            throw new InternalServerError(`Random API - Error: ${err.message}`);
        }
    }

}