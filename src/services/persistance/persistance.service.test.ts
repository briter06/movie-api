import 'reflect-metadata';
import { EnvironmentService } from '@config/env/environment.service';
import { PersistanceService } from '@services/persistance/persistance.service';

describe("Persistance tests", () => {

    let environService: EnvironmentService;
    let persistanceService: PersistanceService;
    const params = {
        jwtExpirationTime: '30s'
    }

    beforeEach(()=>{
        environService = new EnvironmentService();
        environService.getVariables = jest.fn(()=>({
            port: '3000',
            loggerlevel: 'OFF',
            jwtSecret: '123456',
            rootPath: '/api'
        }))
        persistanceService = new PersistanceService(environService);
    })

    test('Get User', async ()=>{
        persistanceService.getUser = jest.fn(async (username: string)=>({
            username,
            password: 'password'
        }));

        const user = 'username'
        const result = await persistanceService.getUser(user)
        expect(result.username).toEqual(user);
    })

    test('Get Params', async ()=>{
        persistanceService.getParams = jest.fn(async ()=>params);
        const result = await persistanceService.getParams()
        expect(result).toEqual(params);
    })
})