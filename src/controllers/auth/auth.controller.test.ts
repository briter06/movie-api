import 'reflect-metadata';
import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from './auth.controller';
import { AuthService } from '@services/auth/auth.service';
import { EnvironmentService } from '@config/env/environment.service';

describe('Movies Controller', ()=>{
    let authController: AuthController;
    let authService: AuthService;
    let environService: EnvironmentService;

    beforeEach(()=>{
        environService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>({
            port: '3000',
            jwtSecret: '123456',
            rootPath: '/api',
            loggerlevel: 'OFF',
        }))
        authService = new AuthService(environService);
        authController = new AuthController(authService);

    })

    test('Login', ()=>{
        const request = createRequest({
            method: 'POST',
            url: '/auth/login'
        });
        const response = createResponse();
        const result = authController.login(request, response, ()=>{});
        expect(result.data.access_token).toBeDefined();
        expect(typeof result.data.access_token).toEqual("string");
    })

})