import { ApiErrors } from "@enums/errors.enum";
import { InternalServerError } from "@errors/internalServer.error";
import { RequestSchemaError } from "@errors/requestScheme.error"
import { createRequest, createResponse } from "node-mocks-http";
import { errorFilter } from "./error.filter";

describe('Error filter tests', ()=>{

    test('RequestSchemeError', ()=>{
        const error = new RequestSchemaError('Error');
        const request = createRequest({
            method: 'POST',
            url: '/auth/login'
        });
        const response = createResponse();
        const result = errorFilter(error, request, response, ()=>{});
        expect(result?.statusCode).toEqual(400);
        expect(error.getResponse().error).toEqual(ApiErrors.REQUEST_SCHEMA_ERROR);
    })

    test('InternalServerError', ()=>{
        const error = new InternalServerError('Error');
        const request = createRequest({
            method: 'POST',
            url: '/auth/login'
        });
        const response = createResponse();
        const result = errorFilter(error, request, response, ()=>{});
        expect(result?.statusCode).toEqual(500);
        expect(error.getResponse().error).toEqual(ApiErrors.INTERNAL_SERVER_ERROR);
    })

})