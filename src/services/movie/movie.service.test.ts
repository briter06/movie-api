import 'reflect-metadata';
import { MovieService } from "./movie.service";

describe("MovieService tests", () => {

    let movieService: MovieService;

    beforeEach(()=>{
        movieService = new MovieService();
    })

    test('Basic data test', () => {
        const movies = movieService.getMovies();
        expect(movies).toEqual({data: true});
    })
})