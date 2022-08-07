import 'reflect-metadata';
import { getSampleServices, SampleServices } from '@utils/environment.sample';

describe("RandomService tests", () => {

    let services: SampleServices;
    beforeEach(()=>{
        services = getSampleServices();
    })

    test('Get Random Number test', async () => {
        const result = await services.randomService.getRandomNumber({});
        expect(result).toEqual(10);
    })
})