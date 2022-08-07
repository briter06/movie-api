import 'reflect-metadata';
import { MovieController } from "./movies.controller"
import { createRequest, createResponse } from "node-mocks-http";
import { ApiRequest } from '@schemas/ApiRequest';
import { getSampleServices, SampleServices } from '@utils/environment.sample';
import { VISIBILITY } from '@enums/visibility.enum';
import { STATUS } from '@enums/status.enum';

describe('Movies Controller', ()=>{

    let movieController: MovieController;
    let services: SampleServices;

    beforeEach(()=>{
        services = getSampleServices();
        movieController = new MovieController(services.movieService);
    })

    test('Get movies', async ()=>{
        const request: ApiRequest = createRequest({
            method: 'GET',
            url: '/movies',
            user: {}
        });
        const response = createResponse();
        const result = await movieController.getMovies(request, response, ()=>{});
        expect(result).toEqual({data:[]});
    })

    test('Create movie', async ()=>{
        const request: ApiRequest = createRequest({
            method: 'POST',
            url: '/movies',
            user: {},
            body: {
                release_date: '2022-05-05',
                visibility: VISIBILITY.PUBLIC,
                description: 'description',
                title: 'title',
                actors: []
            }
        });
        const response = createResponse();
        const result = await movieController.createMovie(request, response, ()=>{});
        expect(result).toEqual({data:{status: STATUS.SUCCESS}});
    })

    test('Delete movie', async ()=>{
        const request: ApiRequest = createRequest({
            method: 'DELETE',
            url: '/movies',
            user: {},
            body: {
                movieId: '1234'
            }
        });
        const response = createResponse();
        services.persistanceService.scanRecords = jest.fn(async ()=>([{data:true}]));
        const result = await movieController.deleteMovie(request, response, ()=>{});
        expect(result).toEqual({data:{status: STATUS.SUCCESS}});
    })

    test('Update movie', async ()=>{
        const request: ApiRequest = createRequest({
            method: 'PUT',
            url: '/movies',
            user: {},
            body: {
                movieId: '1234',
                data: {}
            }
        });
        const response = createResponse();
        services.persistanceService.scanRecords = jest.fn(async ()=>([{data:true}]));
        const result = await movieController.updateMovie(request, response, ()=>{});
        expect(result).toEqual({data:{status: STATUS.SUCCESS}});
    })

})