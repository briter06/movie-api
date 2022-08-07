import 'reflect-metadata';
import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from './auth.controller';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT } from '@utils/environment.sample';
import { STATUS } from '@enums/status.enum';

describe('Auth Controller', ()=>{
    let authController: AuthController;
    let services: SampleServices;

    beforeEach(()=>{
        services = getSampleServices();
        authController = new AuthController(services.authService);
    })

    test('Login', async () => {
        const request = createRequest({
            method: 'POST',
            url: '/auth/login',
            body: {
                username: 'username',
                password: 'password'
            }
        });
        const response = createResponse();
        const result = await authController.login(request, response, ()=>{});
        expect(result.data.access_token).toBeDefined();
        expect(typeof result.data.access_token).toEqual("string");
    })

    test('Signup', async () => {
        const request = createRequest({
            method: 'POST',
            url: '/auth/signup',
            body: {
                username: 'username',
                password: 'pass',
                name: 'name'
            }
        });
        const response = createResponse();
        services.persistanceService.getByKey = jest.fn(async ()=>null);
        const result = await authController.signup(request, response, ()=>{});
        expect(result.data.status).toBeDefined();
        expect(result.data.status).toEqual(STATUS.SUCCESS);
    })

})