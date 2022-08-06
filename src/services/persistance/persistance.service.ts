import { EnvironmentService } from "@config/env/environment.service";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { User } from "@models/User";
import { Params } from "@schemas/Params";
import { inject } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, ScanCommandInput } from "@aws-sdk/lib-dynamodb";
import { UserNoExistsError } from "@errors/userNoExists.error";
import { IncorrectLoginError } from "@errors/incorrectLogin.error";
import { InternalServerError } from "@errors/internalServer.error";
import { EnvironmentVariables } from "@config/env/environmentVariables";
import { Movie } from "@models/Movie";
import { STATUS } from "@enums/status.enum";

@provide(TYPE.PersistanceService)
export class PersistanceService{

    // private dynamo: AWS.DynamoDB.DocumentClient;
    private dynamo!: DynamoDBDocumentClient;
    private table!: string;

    constructor(
        @inject(TYPE.EnvironmentService) private environService: EnvironmentService
    ){}

    public initAWSDynamoDB(){
        const variables: EnvironmentVariables = this.environService.getVariables();
        const marshallOptions = {
            convertEmptyValues: false,
            removeUndefinedValues: true,
            convertClassInstanceToMap: true,
        };
        const unmarshallOptions = {
            wrapNumbers: false,
        };
        const translateConfig = { marshallOptions, unmarshallOptions };
        const ddbClient = new DynamoDBClient({
            region: variables.awsDefaultRegion,
            credentials: {
                accessKeyId: variables.awsAccessKey,
                secretAccessKey: variables.awsSecretAccessKey
            }
        });
        this.dynamo = DynamoDBDocumentClient.from(ddbClient,translateConfig);
        this.table = variables.awsDynamoTableName;
    }

    public async createUser(user: User): Promise<{status: STATUS}>{
        const params = {
            TableName: this.table,
            Item:{
                PK: `USER#${user.username}`,
                SK: `USER#${user.username}`,
                password: user.password,
                name: user.name
            }
        };
        await this.dynamo.send(new PutCommand(params));
        return {
            status: STATUS.SUCCESS
        }
    }

    public async getUser(username: string, password?: string): Promise<User> {
        const params = {
            TableName: this.table,
            Key: {
                PK: `USER#${username}`,
                SK: `USER#${username}`,
            }
        };
        const data = await this.dynamo.send(new GetCommand(params));
        if(data.Item){
            const userData: User = data.Item as User;
            if(password){
                if(password!==userData.password){
                    throw new IncorrectLoginError('Incorrect login');
                }
            }
            return {
                username,
                name: userData.name
            }
        }
        throw new UserNoExistsError('User does not exist');
    }

    public async userExists(username: string){
        const params = {
            TableName: this.table,
            Key: {
                PK: `USER#${username}`,
                SK: `USER#${username}`,
            }
        };
        const data = await this.dynamo.send(new GetCommand(params));
        if(data.Item){
            return true;
        }
        return false;
    }

    public async getParams(): Promise<Params>{
        const params = {
            TableName: this.table,
            Key: {
                PK: `PARAMS`,
                SK: `PARAMS`,
            }
        };
        const data = await this.dynamo.send(new GetCommand(params));
        if(data.Item){
            const parameters: Params = data.Item as Params;
            return {
                jwtExpirationTime: parameters.jwtExpirationTime
            }
        }
        throw new InternalServerError('No parameters detected');
    }

    public async getMovies(ownerId?:string): Promise<Movie[]>{
        const params: ScanCommandInput = {
            ProjectionExpression: "release_date, SK, description, title, visibility",
            TableName: this.table
        }
        if(ownerId){
            params.FilterExpression = "begins_with(#SK,:movieIdentifier) and #PK = :userId"
            params.ExpressionAttributeValues = {
                ":movieIdentifier": "MOVIE#",
                ":userId": `USER#${ownerId}`,
            }
            params.ExpressionAttributeNames = {
                "#SK": "SK",
                "#PK": "PK"
            }
        }else{
            params.FilterExpression = "begins_with(#SK,:movieIdentifier) and #visibility = :visibility"
            params.ExpressionAttributeValues = {
                ":movieIdentifier": "MOVIE#",
                ":visibility": "public",
            }
            params.ExpressionAttributeNames = {
                "#SK": "SK",
                "#visibility": "visibility"
            }
        }
        const moviesResult = await this.dynamo.send(new ScanCommand(params));
        let movies: Movie[] = [];
        if(moviesResult.Items){
            movies = moviesResult.Items as Movie[];
        }
        return movies;
    }

}