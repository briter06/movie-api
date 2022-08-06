import Joi from "joi"

export interface EnvironmentVariables{
    awsAccessKey: string
    awsDefaultRegion: string
    awsDynamoTableName: string
    awsSecretAccessKey: string
    jwtSecret: string
    loggerlevel: string
    port: string
    rootPath: string
}

export const environmentSchema = Joi.object().keys({
    AWS_ACCESS_KEY: Joi.string().required(),
    AWS_DEFAULT_REGION: Joi.string().required(),
    AWS_DYNAMO_TABLE_NAME: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    LOGGER_LEVEL: Joi.string().required(),
    PORT: Joi.string().required(),
    ROOT_PATH: Joi.string().required()
}).unknown()