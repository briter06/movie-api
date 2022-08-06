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

        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{
                expect(true).toBeDefined();
            });
        }catch(err){
            expect(err).toBeFalsy();
        }
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

        try{
            const result = joiBodyValidator(schema);
            result(request,response,()=>{
                expect(true).toBeUndefined();
            });
        }catch(err){
            expect(err).toBeTruthy();
        }
    })

})