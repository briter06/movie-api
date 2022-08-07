import 'reflect-metadata';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT, SAMPLE_PARAMS } from '@utils/environment.sample';
import { STATUS } from '@enums/status.enum';
import { VISIBILITY } from '@enums/visibility.enum';

describe("Persistance tests", () => {

    let services: SampleServices;

    beforeEach(()=>{
        services = getSampleServices();
    })

    test('Get User', async ()=>{
        const user = 'username'
        const result = await services.persistanceService.getUser(user)
        expect(result.username).toEqual(user);
    })

    test('Get Params', async ()=>{
        const result = await services.persistanceService.getParams()
        expect(result).toEqual(SAMPLE_PARAMS);
    })

    test('Get Movies', async ()=>{
        const result = await services.persistanceService.getMovies()
        expect(result).toEqual([]);
    })

    test('User exists', async ()=>{
        const user = 'username'
        const result = await services.persistanceService.userExists(user)
        expect(result).toEqual(false);
    })

    test('Create user', async ()=>{
        const result = await services.persistanceService.createUser({
            username: 'username',
            password: 'pass',
            name: 'name'
        })
        expect(result).toEqual({status:STATUS.SUCCESS});
    })

    test('Create Movie', async ()=>{
        const result = await services.persistanceService.createMovie({
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
        })
        expect(result).toEqual({status:STATUS.SUCCESS});
    })

    test('Movie exists', async ()=>{
        const user = {
            username: 'username',
            name: 'User'
        }
        const movieId = 'movieId'
        const result = await services.persistanceService.movieExists(user, movieId)
        expect(result).toEqual(true);
    })

    test('Delete Movie', async ()=>{
        const result = await services.persistanceService.deleteMovie({
            username: 'username',
            password: 'pass',
            name: 'name'
        }, 'movieId')
        expect(result).toEqual({status:STATUS.SUCCESS});
    })
})