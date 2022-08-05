import { environmentSchema, EnvironmentVariables } from "./environmentVariables";

export class EnvironmentService{

    private variables!: EnvironmentVariables;

    public loadEnvironment(): {valid: boolean, error?: string}{
        const validationResult = environmentSchema.validate(process.env);
        if(validationResult.error){
            return {valid: false, error: validationResult.error.message}
        }
        this.variables = {
            jwtSecret: validationResult.value.JWT_SECRET,
            port: validationResult.value.PORT,
            rootPath: validationResult.value.ROOT_PATH
        };
        return {valid: true}
    }

    public getVariables(): EnvironmentVariables{
        return this.variables;
    }
}