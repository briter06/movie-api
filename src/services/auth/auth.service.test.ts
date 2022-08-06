import 'reflect-metadata';
import { EnvironmentService } from '@config/env/environment.service';
import { PersistanceService } from '@services/persistance/persistance.service';
import { AuthService } from './auth.service';
import { JsonWebTokenError } from 'jsonwebtoken';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT } from '@utils/environment.sample';

describe("AuthService tests", () => {

    let services: SampleServices;
    const user = {
        username: 'user',
        password: 'pass'
    }

    beforeEach(()=>{
        services = getSampleServices();
    });

    test('Login', async ()=>{
        const result = await services.authService.login("user", "password");
        expect(result).toBeDefined();
        expect(typeof result).toEqual("string");
    })

    test('Test correct jwt token', async ()=>{
        const token = await services.authService.login(user.username,user.password);
        try{
            const result = await services.authService.validateToken(token);
            expect(result).toBeDefined();
            expect(result.username).toEqual(user.username);
        }catch(err){
            expect(err).toBeFalsy();
        }
    })

    test('Test incorrect jwt token', async ()=>{
        const token = 'token';
        try{
            const result = await services.authService.validateToken(token);
            expect(result).toBeUndefined();
        }catch(err){
            expect(err).toBeTruthy();
            expect(err).toBeInstanceOf(JsonWebTokenError);
        }
    })
})