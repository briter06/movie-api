import { EnvironmentService } from "@config/env/environment.service";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { inject } from "inversify";
import { getLogger, Logger } from "log4js";

@provide(TYPE.LoggerService)
export class LoggerService{

    private logger: Logger;

    constructor(
        @inject(TYPE.EnvironmentService) private environService: EnvironmentService
    ){
        const level = this.environService.getVariables().loggerlevel;
        this.logger = getLogger();
        this.logger.level = level;
    }

    public debug(message: any){
        this.logger.debug(message);
    }

    public info(message: any){
        this.logger.info(message);
    }

    public error(message: any){
        this.logger.error(message);
    }

}