import { EnvironmentService } from "@config/env/environment.service";
import { EnvironmentVariables } from "@config/env/environmentVariables";
import { STATUS } from "@enums/status.enum";
import { Params } from "@schemas/Params";
import { AuthService } from "@services/auth/auth.service";
import { MovieService } from "@services/movie/movie.service";
import { PersistanceService } from "@services/persistance/persistance.service";

export interface SampleServices{
    environService: EnvironmentService
    persistanceService: PersistanceService
    authService: AuthService
    movieService: MovieService
}

export const SAMPLE_ENVIRONMENT: EnvironmentVariables = {
    awsAccessKey: '1234',
    awsDefaultRegion: '1234',
    awsDynamoTableName: 'name',
    awsSecretAccessKey: '1234',
    paginationSecret: '1234',
    port: '3000',
    loggerlevel: 'OFF',
    jwtSecret: '123456',
    rootPath: '/api'
}

export const SAMPLE_PARAMS: Params = {
    jwtExpirationTime: '30s'
}

export const getSampleServices = ():SampleServices => {
    const environService: EnvironmentService = new EnvironmentService();
    environService.getVariables = jest.fn(()=>SAMPLE_ENVIRONMENT);
    const persistanceService: PersistanceService = new PersistanceService(environService);
    persistanceService.getByKey = jest.fn(async ()=>({
        PK: 'username',
        password: 'password',
        name: 'name'
    }));
    persistanceService.getParams = jest.fn(async ()=>SAMPLE_PARAMS);
    persistanceService.scanRecords = jest.fn(async ()=>({
        result: [],
        lastEvaluatedKey: undefined
    }));
    persistanceService.createItem = jest.fn(async ()=>({status:STATUS.SUCCESS}));
    persistanceService.deleteItem = jest.fn(async ()=>({status:STATUS.SUCCESS}));
    persistanceService.updateItem = jest.fn(async ()=>({status:STATUS.SUCCESS}));
    const authService: AuthService = new AuthService(environService, persistanceService);
    const movieService: MovieService = new MovieService(environService,persistanceService);

    return {
        environService,
        persistanceService,
        authService,
        movieService
    }
}