import 'reflect-metadata';
import { createRequest, createResponse } from "node-mocks-http";
import { ApiRequest } from '@schemas/ApiRequest';
import { getSampleServices, SampleServices } from '@utils/environment.sample';
import { RandomController } from './random.controller';

describe('Random Controller', ()=>{

    let randomController: RandomController;
    let services: SampleServices;

    beforeEach(()=>{
        services = getSampleServices();
        randomController = new RandomController(services.randomService);
    })

    test('Get random number', async ()=>{
        const request: ApiRequest = createRequest({
            method: 'GET',
            url: '/random',
            user: {}
        });
        const response = createResponse();
        const result = await randomController.getRandomNumber(request, response, ()=>{});
        expect(result).toEqual({data:{number:10}});
    })

})