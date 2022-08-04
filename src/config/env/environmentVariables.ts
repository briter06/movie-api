import Joi from "joi"

export interface EnvironmentVariables{
    port: string
}

export const environmentSchema = Joi.object().keys({
    PORT: Joi.string().required()
}).unknown()