import { EnvironmentService } from "@config/env/environment.service";
import { EnvironmentVariables } from "@config/env/environmentVariables";
import { STATUS } from "@enums/status.enum";
import { Params } from "@schemas/Params";
import { AuthService } from "@services/auth/auth.service";
import { LoggerService } from "@services/logger/logger.service";
import { MovieService } from "@services/movie/movie.service";
import { PersistanceService } from "@services/persistance/persistance.service";
import { RandomService } from "@services/random/random.service";
import { getHashPassword } from "./hash.crypto";

export interface SampleServices{
    environService: EnvironmentService
    persistanceService: PersistanceService
    authService: AuthService
    movieService: MovieService
    randomService: RandomService
}

export const SAMPLE_ENVIRONMENT: EnvironmentVariables = {
    awsAccessKey: '1234',
    awsDefaultRegion: '1234',
    awsDynamoTableName: 'name',
    awsSecretAccessKey: '1234',
    paginationSecret: '1234',
    randomApi: 'http://random/api',
    port: '3000',
    loggerlevel: 'OFF',
    jwtSecret: '123456',
    rootPath: '/api'
}

export const SAMPLE_PARAMS: Params = {
    jwtExpirationTime: '20m'
}

export const getSampleServices = ():SampleServices => {
    const environService: EnvironmentService = new EnvironmentService();
    environService.getVariables = jest.fn(()=>SAMPLE_ENVIRONMENT);
    const loggerService: LoggerService = new LoggerService(environService);
    const persistanceService: PersistanceService = new PersistanceService(environService);
    persistanceService.getByKey = jest.fn(async ()=>({
        PK: 'username',
        password: getHashPassword('password'),
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
    const randomService: RandomService = new RandomService(loggerService, environService);
    randomService.getRandomNumber = jest.fn(async ()=>10);

    return {
        environService,
        persistanceService,
        authService,
        movieService,
        randomService
    }
}