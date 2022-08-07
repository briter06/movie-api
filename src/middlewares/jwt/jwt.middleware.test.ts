import 'reflect-metadata';
import { createRequest, createResponse } from "node-mocks-http";
import { JwtMiddleware } from './jwt.middleware';
import { ApiRequest } from '@schemas/ApiRequest';
import { ForbiddenError } from '@errors/forbidden.error';
import { getSampleServices, SampleServices } from '@utils/environment.sample';

describe('Jwt Validator Tests', ()=>{

    let jwtMiddleware: JwtMiddleware;
    let services: SampleServices;
    const user = {
        username: 'username',
        password: 'password'
    }

    beforeEach(()=>{
        services = getSampleServices();
        jwtMiddleware = new JwtMiddleware(services.authService);
    });

    test('Test correct jwt token', async ()=>{
        const token = await services.authService.login(user.username,user.password);
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
                expect(request.user.username).toEqual(user.username);
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