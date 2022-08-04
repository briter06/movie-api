import 'reflect-metadata';
import { MovieService } from "@services/movie/movie.service";
import { MovieController } from "./movies.controller"
import { createRequest, createResponse } from "node-mocks-http";

describe('Movies Controller', ()=>{
    let movieController: MovieController;
    let movieService: MovieService;

    beforeEach(()=>{

        movieService = new MovieService();
        movieController = new MovieController(movieService);

    })

    test('Get movies', ()=>{
        const request = createRequest({
            method: 'GET',
            url: '/movies'
        });
        const response = createResponse();
        const result = movieController.getMovies(request, response, ()=>{});
        expect(result).toEqual({data: true});
    })

})