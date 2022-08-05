import 'reflect-metadata';
import { createRequest, createResponse } from "node-mocks-http";
import { AuthController } from './auth.controller';
import { AuthService } from '@services/auth/auth.service';
import { EnvironmentService } from '@config/env/environment.service';
import { PersistanceService } from '@services/persistance/persistance.service';

describe('Movies Controller', ()=>{
    let authController: AuthController;
    let authService: AuthService;
    let environService: EnvironmentService;
    let persistanceService: PersistanceService;

    beforeEach(()=>{
        environService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>({
            port: '3000',
            jwtSecret: '123456',
            rootPath: '/api',
            loggerlevel: 'OFF',
        }))
        persistanceService = new PersistanceService(environService);
        authService = new AuthService(environService, persistanceService);
        authController = new AuthController(authService);

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