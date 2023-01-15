/* eslint-disable class-methods-use-this */
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { FirstLambda } from '../lambda/first-lambda';
import { NodeModuleLayer } from '../lambda/node-module-layer';

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    const api = new RestApi(this, 'api-gateway-stack', {
      restApiName: 'First Bot',
      description: 'First Bot Rest Api',
    });

    // layers
    const nodeModuleLayer = new NodeModuleLayer(this, 'node-module-layer');

    // lambdas
    const firstLambda = new FirstLambda(this, 'first-lambda-function', [
      nodeModuleLayer.layer,
    ]);

    // integrations
    const firstIntegration = this.getLambdaIntegration(firstLambda.handler);

    // routes
    const firstRoute = api.root.addResource('first');

    // proxy
    firstRoute.addProxy({ defaultIntegration: firstIntegration });
  }

  getLambdaIntegration = (handler: IFunction) =>
    new LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });
}
