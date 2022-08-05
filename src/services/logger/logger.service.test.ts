import 'reflect-metadata';
import { EnvironmentService } from "@config/env/environment.service";
import { LoggerService } from "./logger.service";

describe('Logger tests', ()=>{

    test('Logger construction', ()=>{

        const environService: EnvironmentService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>({
            port: '3000',
            loggerlevel: 'OFF',
            jwtSecret: '123456',
            rootPath: '/api'
        }))
        const loggerService: LoggerService= new LoggerService(environService);
        expect(loggerService).toBeDefined();

    })

})