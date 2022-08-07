import 'reflect-metadata';
import { getSampleServices, SampleServices, SAMPLE_ENVIRONMENT, SAMPLE_PARAMS } from '@utils/environment.sample';
import { STATUS } from '@enums/status.enum';
import { VISIBILITY } from '@enums/visibility.enum';

describe("Persistance tests", () => {

    let services: SampleServices;

    beforeEach(()=>{
        services = getSampleServices();
    })

    test('Get By Key', async ()=>{
        const user = 'username'
        const result = await services.persistanceService.getByKey([],{PK:'',SK:''});
        expect(result?.PK).toEqual(user);
    })

    test('Get Params', async ()=>{
        const result = await services.persistanceService.getParams()
        expect(result).toEqual(SAMPLE_PARAMS);
    })

    test('Scan records', async ()=>{
        const result = await services.persistanceService.scanRecords([],{})
        expect(result.result).toEqual([]);
    })

    test('Create item', async ()=>{
        const result = await services.persistanceService.createItem({
            PK: '1234',
            SK: '1234'
        },{})
        expect(result).toEqual({status:STATUS.SUCCESS});
    })

    test('Delete Item', async ()=>{
        const result = await services.persistanceService.deleteItem({
            PK: '1234',
            SK: '1234'
        })
        expect(result).toEqual({status:STATUS.SUCCESS});
    })

    test('Update item', async ()=>{
        const result = await services.persistanceService.updateItem({
            PK: '1234',
            SK: '1234'
        }, 'movieId')
        expect(result).toEqual({status:STATUS.SUCCESS});
    })
})