import 'reflect-metadata';
import { MovieService } from "@services/movie/movie.service";
import { MovieController } from "./movies.controller"
import { createRequest, createResponse } from "node-mocks-http";
import { ApiRequest } from '@schemas/ApiRequest';
import { EnvironmentService } from '@config/env/environment.service';
import { PersistanceService } from '@services/persistance/persistance.service';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT } from '@utils/environment.sample';

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

})