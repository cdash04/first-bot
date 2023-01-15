import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ApiGatewayStack } from './api-gateway/api-gateway-stack';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const apiGateway = new ApiGatewayStack(this, 'first-bot-api-gateway');
  }
}
