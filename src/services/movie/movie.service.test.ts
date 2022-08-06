import 'reflect-metadata';
import { EnvironmentService } from '@config/env/environment.service';
import { PersistanceService } from '@services/persistance/persistance.service';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT } from '@utils/environment.sample';
import { MovieService } from "./movie.service";

describe("MovieService tests", () => {

    let services: SampleServices;
    beforeEach(()=>{
        services = getSampleServices();
    })

    test('Basic data test', async () => {
        const movies = await services.movieService.getMovies();
        expect(movies).toEqual({data: true});
    })
})