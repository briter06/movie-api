import 'reflect-metadata';
import { JsonWebTokenError } from 'jsonwebtoken';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT } from '@utils/environment.sample';
import { STATUS } from '@enums/status.enum';

describe("AuthService tests", () => {

    let services: SampleServices;
    const user = {
        username: 'username',
        password: 'password'
    }

    beforeEach(()=>{
        services = getSampleServices();
    });

    test('Login', async ()=>{
        const result = await services.authService.login("user", "password");
        expect(result).toBeDefined();
        expect(typeof result).toEqual("string");
    })

    test('Signup', async ()=>{
        services.persistanceService.getByKey = jest.fn(async ()=>null);
        const result = await services.authService.signup({
            username: 'username',
            password: 'pass',
            name: 'name'
        });
        expect(result).toBeDefined();
        expect(result).toEqual({status:STATUS.SUCCESS});
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