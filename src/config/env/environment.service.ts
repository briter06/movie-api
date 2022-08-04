import { environmentSchema, EnvironmentVariables } from "./environmentVariables";

export class EnvironmentService{

    private variables!: EnvironmentVariables;

    public loadEnvironment(): {valid: boolean, error?: string}{
        const validationResult = environmentSchema.validate(process.env);
        if(validationResult.error){
            return {valid: false, error: validationResult.error.message}
        }
        this.variables = {
            port: validationResult.value.PORT
        };
        return {valid: true}
    }

    public getVariables(): EnvironmentVariables{
        return this.variables;
    }
}