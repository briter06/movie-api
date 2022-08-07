import { environmentSchema, EnvironmentVariables } from "./environmentVariables";

export class EnvironmentService{

    private variables!: EnvironmentVariables;

    public loadEnvironment(): {valid: boolean, error?: string}{
        const validationResult = environmentSchema.validate(process.env);
        if(validationResult.error){
            return {valid: false, error: validationResult.error.message}
        }
        this.variables = {
            awsAccessKey: validationResult.value.AWS_ACCESS_KEY,
            awsDefaultRegion: validationResult.value.AWS_DEFAULT_REGION,
            awsDynamoTableName: validationResult.value.AWS_DYNAMO_TABLE_NAME,
            awsSecretAccessKey: validationResult.value.AWS_SECRET_ACCESS_KEY,
            jwtSecret: validationResult.value.JWT_SECRET,
            loggerlevel: validationResult.value.LOGGER_LEVEL,
            paginationSecret: validationResult.value.PAGINATION_SECRET,
            port: validationResult.value.PORT,
            rootPath: validationResult.value.ROOT_PATH
        };
        return {valid: true}
    }

    public getVariables(): EnvironmentVariables{
        return this.variables;
    }
}