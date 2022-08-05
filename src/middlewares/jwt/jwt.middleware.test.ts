import 'reflect-metadata';
import { EnvironmentService } from "@config/env/environment.service";
import { AuthService } from "@services/auth/auth.service";
import { PersistanceService } from "@services/persistance/persistance.service";
import { createRequest, createResponse } from "node-mocks-http";
import { JwtMiddleware } from './jwt.middleware';
import { ApiRequest } from '@schemas/ApiRequest';
import { ForbiddenError } from '@errors/forbidden.error';

describe('Jwt Validator Tests', ()=>{

    let authService: AuthService;
    let environService: EnvironmentService;
    let persistanceService: PersistanceService;
    let jwtMiddleware: JwtMiddleware;
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
        jwtMiddleware = new JwtMiddleware(authService);
    });

    test('Test correct jwt token', async ()=>{
        const token = await authService.login(user.username,user.password);
        try{
            const request: ApiRequest = createRequest({
                method: 'POST',
                url: '/auth/login',
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            const response = createResponse();
            jwtMiddleware.handler(request,response,jest.fn(()=>{
                expect(request.user).toEqual(user);
            }));
        }catch(err){
            expect(err).toBeFalsy();
        }
    })

    test('Test incorrect jwt token', async ()=>{
        const token = '123456';
        try{
            const request: ApiRequest = createRequest({
                method: 'POST',
                url: '/auth/login',
                headers: {
                    authorization: `Bearer ${token}`
                }
            });
            const response = createResponse();
            jwtMiddleware.handler(request,response,jest.fn(()=>{
                expect(request.user).toBeUndefined();
            }));
        }catch(err){
            expect(err).toBeFalsy();
        }
    })

    test('Test no jwt token', async ()=>{
        try{
            const request: ApiRequest = createRequest({
                method: 'POST',
                url: '/auth/login'
            });
            const response = createResponse();
            jwtMiddleware.handler(request,response,()=>{});
        }catch(err){
            expect(err).toBeTruthy();
            expect(err).toBeInstanceOf(ForbiddenError);
        }
    })

})