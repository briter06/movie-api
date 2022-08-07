import 'reflect-metadata';
import { getSampleServices, SampleServices } from '@utils/environment.sample';
import { VISIBILITY } from '@enums/visibility.enum';
import { STATUS } from '@enums/status.enum';

describe("MovieService tests", () => {

    let services: SampleServices;
    beforeEach(()=>{
        services = getSampleServices();
    })

    test('Get Movies test', async () => {
        const result = await services.movieService.getMovies({});
        expect(result.movies).toEqual([]);
    })

    test('Create Movies test', async () => {
        const result = await services.movieService.createMovie({
            username: 'username',
            password: 'pass',
            name: 'name'
        }, {
            title: 'title',
            actors:[],
            description: 'description',
            release_date: '2022-05-05',
            visibility: VISIBILITY.PUBLIC,
            id: '1234'
        });
        expect(result).toEqual({status:STATUS.SUCCESS});
    })

    test('Delete Movie test', async () => {
        services.persistanceService.scanRecords = jest.fn(async ()=>({
            result: [{data:true}],
            lastEvaluatedKey: undefined
        }));
        const result = await services.movieService.deleteMovie({
            username: 'username',
            password: 'pass',
            name: 'name'
        }, 'movieId')
        expect(result).toEqual({status:STATUS.SUCCESS});
    })

    test('Update Movie test', async () => {
        services.persistanceService.scanRecords = jest.fn(async ()=>({
            result: [{data:true}],
            lastEvaluatedKey: undefined
        }));
        const result = await services.movieService.updateMovie({
            username: 'username',
            password: 'pass',
            name: 'name'
        }, 'movieId', {})
        expect(result).toEqual({status:STATUS.SUCCESS});
    })
})