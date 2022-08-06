import { InvalidEmailError } from "@errors/invalidEmail.error";
import { InvalidPasswordError } from "@errors/invalidPassword.error";
import Joi from "joi"
import { createRequest, createResponse } from "node-mocks-http";
import { joiBodyValidator } from "./joi.middleware";

describe('Joi Validator Tests', ()=>{

    test('Validate correct schema', ()=>{
        const schema = Joi.object().keys({
            name: Joi.string().required()
        });
        const request = createRequest({
            method: 'POST',
            url: '/auth/login',
            body: {
                name: "Name"
            }
        });
        const response = createResponse();
        let error;
        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{});
        }catch(err){
            error = err;
        }
        expect(error).toBeFalsy();
    })

    test('Validate incorrect schema', ()=>{
        const schema = Joi.object().keys({
            name: Joi.string().required()
        });
        const request = createRequest({
            method: 'POST',
            url: '/auth/login',
            body: {}
        });
        const response = createResponse();
        let error;
        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{});
        }catch(err){
            error = err;
        }
        expect(error).toBeTruthy();
    })

    test('Validate email custom error - Valid', ()=>{
        const schema = Joi.object().keys({
            username: Joi.string().required().email({ tlds: { allow: false } }).label('email')
        });
        const request = createRequest({
            method: 'POST',
            url: '/auth/login',
            body: {
                username: 'user@gmail.com'
            }
        });
        const response = createResponse();
        let error;
        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{});
        }catch(err){
            error = err;
        }
        expect(error).toBeFalsy();
    })

    test('Validate email custom error - Invalid', ()=>{
        const schema = Joi.object().keys({
            username: Joi.string().required().email({ tlds: { allow: false } }).label('email')
        });
        const request = createRequest({
            method: 'POST',
            url: '/auth/login',
            body: {
                username: 'user@gmailcom'
            }
        });
        const response = createResponse();
        let error;
        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{});
        }catch(err){
            error = err;
        }
        expect(error).toBeTruthy();
        expect(error).toBeInstanceOf(InvalidEmailError);
    })

    test('Validate password custom error - Valid', ()=>{
        const schema = Joi.object().keys({
            password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#?\]]).{10,}$/).label('password')
        });
        const request = createRequest({
            method: 'POST',
            url: '/auth/login',
            body: {
                password: 'Us#er12345'
            }
        });
        const response = createResponse();
        let error;
        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{});
        }catch(err){
            error = err;
        }
        expect(error).toBeFalsy();
    })

    test('Validate email custom error - Invalid', ()=>{
        const schema = Joi.object().keys({
            password: Joi.string().required().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#?\]]).{10,}$/).label('password')
        });
        const request = createRequest({
            method: 'POST',
            url: '/auth/login',
            body: {
                password: 'us#er12345'
            }
        });
        const response = createResponse();
        let error;
        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{});
        }catch(err){
            error = err;
        }
        expect(error).toBeTruthy();
        expect(error).toBeInstanceOf(InvalidPasswordError);
    })

})