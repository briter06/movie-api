import 'reflect-metadata';
import { EnvironmentService } from '@config/env/environment.service';
import { PersistanceService } from '@services/persistance/persistance.service';
import { AuthService } from './auth.service';
import { JsonWebTokenError } from 'jsonwebtoken';

describe("AuthService tests", () => {

    let authService: AuthService;
    let environService: EnvironmentService;
    let persistanceService: PersistanceService;
    const params = {
        jwtExpirationTime: '30m'
    }
    const user = {
        username: 'user',
        password: 'pass'
    }

    beforeEach(()=>{
        environService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>({
            port: '3000',
            loggerlevel: 'OFF',
            jwtSecret: '123456',
            rootPath: '/api'
        }))
        persistanceService = new PersistanceService(environService);
        persistanceService.getParams = jest.fn(async ()=>params);
        persistanceService.getUser = jest.fn(async ()=>user);
        authService = new AuthService(environService, persistanceService);
    });

    test('Login', async ()=>{
        const result = await authService.login("user", "password");
        expect(result).toBeDefined();
        expect(typeof result).toEqual("string");
    })

    test('Test correct jwt token', async ()=>{
        const token = await authService.login(user.username,user.password);
        try{
            const result = await authService.validateToken(token);
            expect(result).toBeDefined();
            expect(result).toEqual(user);
        }catch(err){
            expect(err).toBeFalsy();
        }
    })

    test('Test incorrect jwt token', async ()=>{
        const token = 'token';
        try{
            const result = await authService.validateToken(token);
            expect(result).toBeUndefined();
        }catch(err){
            expect(err).toBeTruthy();
            expect(err).toBeInstanceOf(JsonWebTokenError);
        }
    })
})