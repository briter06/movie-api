import 'reflect-metadata';
import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from './auth.controller';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT } from '@utils/environment.sample';

describe('Movies Controller', ()=>{
    let authController: AuthController;
    let services: SampleServices;

    beforeEach(()=>{
        services = getSampleServices();
        authController = new AuthController(services.authService);
    })

    test('Login', async () => {
        const request = createRequest({
            method: 'POST',
            url: '/auth/login'
        });
        const response = createResponse();
        const result = await authController.login(request, response, ()=>{});
        expect(result.data.access_token).toBeDefined();
        expect(typeof result.data.access_token).toEqual("string");
    })

})