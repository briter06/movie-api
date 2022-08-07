import { EnvironmentService } from "@config/env/environment.service";
import { provide } from "@config/ioc/inversify.config";
import { TYPE } from "@config/ioc/types";
import { Params } from "@schemas/Params";
import { inject } from "inversify";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, ScanCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { InternalServerError } from "@errors/internalServer.error";
import { EnvironmentVariables } from "@config/env/environmentVariables";
import { STATUS } from "@enums/status.enum";
import { ScanParams } from "@schemas/ScanParams";
import { ScanOperators } from "@enums/scanOperators.enum";
import { DynamoKeys } from "@models/DynamoKeys";

@provide(TYPE.PersistanceService)
export class PersistanceService{

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

    public async createItem(keys: DynamoKeys, data: any){
        const params = {
            TableName: this.table,
            Item:{
                ...keys,
                ...data
            }
        };
        await this.dynamo.send(new PutCommand(params));
        return {
            status: STATUS.SUCCESS
        }
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

    public async updateItem(keys: DynamoKeys, newData: any){
        const { updateExpresion, expressionAttributesNames, expressionAttributesValues } = this.getUpdateExpressionFields(newData);
        const conditionExpression = Object.keys(keys).map((k)=>`attribute_exists(${k})`).join(' and ');
        const params = {
            TableName: this.table,
            Key: keys,
            ConditionExpression: conditionExpression,
            UpdateExpression: updateExpresion,
            ExpressionAttributeNames: expressionAttributesNames,
            ExpressionAttributeValues: expressionAttributesValues
        };
        await this.dynamo.send(new UpdateCommand(params));
        return {
            status: STATUS.SUCCESS
        }
    }

    private getUpdateExpressionFields(data: any){
        const keys = Object.keys(data);
        const updateExpresion = `set ${keys.map((k)=>`#${k} = :${k}`).join(', ')}`;
        const { expressionAttributesNames, expressionAttributesValues } = this.getNormalExpressionAttributes(data);
        return { updateExpresion, expressionAttributesNames, expressionAttributesValues };
    }

    private getNormalExpressionAttributes(data: any){
        const keys = Object.keys(data);
        const expressionAttributesValues: any = {};
        const expressionAttributesNames: any = {};
        keys.forEach((k)=>{
            expressionAttributesNames[`#${k}`] = `${k}`;
            expressionAttributesValues[`:${k}`] = data[k];
        });
        return { expressionAttributesNames, expressionAttributesValues };
    }

    private getExpressionFieldsToReturn(fieldsToReturn: string[]){
        const fields = fieldsToReturn.map(f=>`#${f}`).join(', ');
        const expressionAttributesNames: any = {};
        fieldsToReturn.forEach((k)=>{
            expressionAttributesNames[`#${k}`] = `${k}`;
        });
        return { fields, expressionAttributesNames };
    }

    public async deleteItem(keys: DynamoKeys){
        const conditionExpression = Object.keys(keys).map((k)=>`attribute_exists(${k})`).join(' and ');
        const params = {
            TableName: this.table,
            Key: keys,
            ConditionExpression: conditionExpression
        };
        await this.dynamo.send(new DeleteCommand(params));
        return {
            status: STATUS.SUCCESS
        }
    }

    public async getByKey(fieldsToReturn: string[],keys: DynamoKeys){
        const { fields, expressionAttributesNames }  = this.getExpressionFieldsToReturn(fieldsToReturn);
        const params = {
            ProjectionExpression: fields,
            ExpressionAttributeNames: expressionAttributesNames,
            TableName: this.table,
            Key: keys
        };
        const data = await this.dynamo.send(new GetCommand(params));
        if(data.Item){
            return data.Item;
        }
        return null;
    }

    public async scanRecords(fieldsToReturn: string[], scanParams: ScanParams){
        const { filterExpression, expressionAttributesNames, expressionAttributesValues } = this.getScanExpressionFields(scanParams);
        const params: ScanCommandInput = {
            ProjectionExpression: fieldsToReturn.join(', '),
            TableName: this.table,
            FilterExpression: filterExpression,
            ExpressionAttributeNames: expressionAttributesNames,
            ExpressionAttributeValues: expressionAttributesValues
        }
        const result = await this.dynamo.send(new ScanCommand(params));
        let arrayResult: any = [];
        if(result.Items){
            arrayResult = result.Items;
        }
        return arrayResult;
    }

    private getScanExpressionFields(scanParams: ScanParams){
        const keys = Object.keys(scanParams);
        const filterExpression = keys.map((k)=>{
            switch(scanParams[k].operator){
                case ScanOperators.BEGINS_WITH:
                    return `begins_with(#${k}, :${k})`
                case ScanOperators.EQUALS:
                default:
                    return `#${k} = :${k}`
            }
        }).join(' and ');
        const expressionAttributesValues: any = {};
        const expressionAttributesNames: any = {};
        keys.forEach((k)=>{
            expressionAttributesNames[`#${k}`] = `${k}`;
            expressionAttributesValues[`:${k}`] = scanParams[k].value;
        });
        return { filterExpression, expressionAttributesNames, expressionAttributesValues };
    }

}