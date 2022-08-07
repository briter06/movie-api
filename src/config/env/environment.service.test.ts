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
            AWS_ACCESS_KEY: '1234',
            AWS_DEFAULT_REGION: '1234',
            AWS_DYNAMO_TABLE_NAME: 'name',
            AWS_SECRET_ACCESS_KEY: '1234',
            PAGINATION_SECRET: '1234',
            RANDOM_API: 'htpp://random/api',
            PORT: "3000",
            ROOT_PATH: "/api",
            JWT_SECRET: "123456",
            LOGGER_LEVEL: 'OFF'
        }
        const validEnvironment = environService.loadEnvironment();
        expect(validEnvironment.valid).toBe(true);
    })

    test('Invalid environment variables', ()=>{
        const validEnvironment = environService.loadEnvironment();
        expect(validEnvironment.valid).toBe(false);
    })
})