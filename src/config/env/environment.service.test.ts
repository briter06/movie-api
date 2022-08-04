import 'reflect-metadata';
import { EnvironmentService } from "./environment.service";

describe('Environment variables', ()=>{

    const realEnvs = process.env;
    let environService: EnvironmentService;

    beforeEach(()=>{
        jest.resetModules();
        process.env = realEnvs;
        environService = new EnvironmentService();
    })

    test('Valid environment variables', ()=>{
        process.env = {
            ...process.env,
            PORT: "3000"
        }
        const validEnvironment = environService.loadEnvironment();
        expect(validEnvironment.valid).toBe(true);
    })

    test('Invalid environment variables', ()=>{
        const validEnvironment = environService.loadEnvironment();
        expect(validEnvironment.valid).toBe(false);
    })
})