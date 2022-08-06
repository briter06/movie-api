import 'reflect-metadata';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT, SAMPLE_PARAMS } from '@utils/environment.sample';
import { STATUS } from '@enums/status.enum';

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
})