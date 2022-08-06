import 'reflect-metadata';
import { EnvironmentService } from '@config/env/environment.service';
import { PersistanceService } from '@services/persistance/persistance.service';
import { SAMPLE_ENVIRONMENT, SAMPLE_PARAMS } from '@utils/environment.sample';

describe("Persistance tests", () => {

    let environService: EnvironmentService;
    let persistanceService: PersistanceService;
    const params = {
        jwtExpirationTime: '30s'
    }

    beforeEach(()=>{
        environService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>SAMPLE_ENVIRONMENT);
        persistanceService = new PersistanceService(environService);
        persistanceService.getUser = jest.fn(async (username: string)=>({
            username,
            name: 'name'
        }));
        persistanceService.getParams = jest.fn(async ()=>SAMPLE_PARAMS);
    })

    test('Get User', async ()=>{
        const user = 'username'
        const result = await persistanceService.getUser(user)
        expect(result.username).toEqual(user);
    })

    test('Get Params', async ()=>{
        const result = await persistanceService.getParams()
        expect(result).toEqual(params);
    })
})