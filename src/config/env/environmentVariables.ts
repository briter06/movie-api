import Joi from "joi"

export interface EnvironmentVariables{
    jwtSecret: string
    port: string
    rootPath: string
}

export const environmentSchema = Joi.object().keys({
    JWT_SECRET: Joi.string().required(),
    PORT: Joi.string().required(),
    ROOT_PATH: Joi.string().required()
}).unknown()