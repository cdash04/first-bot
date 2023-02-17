import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGatewayStack } from './api-gateway/api-gateway-stack';
import { DynamoDbStack } from './dynamo-db/dynamo-db-stack';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dynamoDb = new DynamoDbStack(this, 'first-bot-dynamo-db');

    const apiGateway = new ApiGatewayStack(this, 'first-bot-api-gateway');

    dynamoDb.grantReadWriteAccess(apiGateway.getHandlers());
  }
}
