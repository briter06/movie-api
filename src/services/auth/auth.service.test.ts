import { EnvironmentService } from '@config/env/environment.service';
import 'reflect-metadata';
import { AuthService } from './auth.service';

describe("AuthService tests", () => {

    let authService: AuthService;
    let environService: EnvironmentService;

    beforeEach(()=>{
        environService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>({
            port: '3000',
            loggerlevel: 'OFF',
            jwtSecret: '123456',
            rootPath: '/api'
        }))
        authService = new AuthService(environService);
    })

    test('Login', ()=>{
        const result = authService.login("user", "password");
        expect(result).toBeDefined();
        expect(typeof result).toEqual("string");
    })
})