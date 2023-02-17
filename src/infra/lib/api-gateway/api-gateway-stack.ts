/* eslint-disable class-methods-use-this */
import {
  LambdaIntegration,
  Resource,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import {
  FirstLambda,
  OnlineEventLambda,
  BroadcastersLambda,
  LeaderboardLambda,
  OfflineEventLambda,
  PayToWinLambda,
} from '../lambda';
import { BaseLambda } from '../lambda/base-lambda';

export class ApiGatewayStack extends Construct {
  private readonly api: RestApi;

  readonly handlers: Record<string, BaseLambda> = {};

  readonly integrations: Record<string, LambdaIntegration> = {};

  readonly routes: Record<string, Resource> = {};

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.api = new RestApi(this, 'api-gateway-stack', {
      restApiName: 'First Bot',
      description: 'First Bot Rest Api',
      defaultCorsPreflightOptions: {
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
        ],
        allowMethods: ['OPTIONS', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowCredentials: true,
        allowOrigins: ['http://localhost:3000'],
      },
    });

    // lambdas
    this.handlers.firstLambda = new FirstLambda(this, 'first-lambda-function');
    this.handlers.broadcastersLambda = new BroadcastersLambda(
      this,
      'broadcasters-lambda-function',
    );
    this.handlers.onlineEventLambda = new OnlineEventLambda(
      this,
      'online-event-lambda-function',
    );
    this.handlers.offlineEventLambda = new OfflineEventLambda(
      this,
      'offline-event-lambda-function',
    );
    this.handlers.leaderboardLambda = new LeaderboardLambda(
      this,
      'leaderboard-lambda-function',
    );
    this.handlers.payToWinLambda = new PayToWinLambda(
      this,
      'pay-to-win-lambda-function',
    );

    // integrations
    this.integrations.firstIntegration = this.getLambdaIntegration(
      this.handlers.firstLambda.handler,
    );
    this.integrations.onlineEventIntegration = this.getLambdaIntegration(
      this.handlers.onlineEventLambda.handler,
    );
    this.integrations.broadcastersIntegration = this.getLambdaIntegration(
      this.handlers.broadcastersLambda.handler,
    );
    this.integrations.leaderboardIntegration = this.getLambdaIntegration(
      this.handlers.leaderboardLambda.handler,
    );
    this.integrations.offlineEventIntegration = this.getLambdaIntegration(
      this.handlers.offlineEventLambda.handler,
    );
    this.integrations.payToWinIntegration = this.getLambdaIntegration(
      this.handlers.payToWinLambda.handler,
    );

    // routes
    this.routes.firstRoute = this.api.root.addResource('firsts');
    this.routes.broadcastersRoute = this.api.root.addResource('broadcasters');
    this.routes.leaderboardRoute = this.api.root.addResource('leaderboards');
    this.routes.payToWinRoute = this.api.root.addResource('pay-to-win');

    // base route access
    this.routes.firstRoute.addMethod('ANY', this.integrations.firstIntegration);
    this.routes.broadcastersRoute.addMethod(
      'ANY',
      this.integrations.broadcastersIntegration,
    );
    this.routes.leaderboardRoute.addMethod(
      'ANY',
      this.integrations.leaderboardIntegration,
    );
    this.routes.payToWinRoute.addMethod(
      'ANY',
      this.integrations.payToWinIntegration,
    );

    // webhooks
    this.routes.webhookRoute = this.api.root.addResource('events');
    this.routes.onlineEventRoute =
      this.routes.webhookRoute.addResource('online');
    this.routes.offlineEventRoute =
      this.routes.webhookRoute.addResource('offline');

    // webhooks POST
    this.routes.onlineEventRoute.addMethod(
      'POST',
      this.integrations.onlineEventIntegration,
    );
    this.routes.offlineEventRoute.addMethod(
      'POST',
      this.integrations.offlineEventIntegration,
    );

    // proxy
    this.routes.firstRoute.addProxy({
      defaultIntegration: this.integrations.firstIntegration,
    });
    this.routes.broadcastersRoute.addProxy({
      defaultIntegration: this.integrations.broadcastersIntegration,
    });
    this.routes.leaderboardRoute.addProxy({
      defaultIntegration: this.integrations.leaderboardIntegration,
    });
    this.routes.payToWinRoute.addProxy({
      defaultIntegration: this.integrations.payToWinIntegration,
    });
  }

  getHandlers(): IFunction[] {
    return Object.values(this.handlers).map((value) => value.handler);
  }

  private getLambdaIntegration = (handler: IFunction) =>
    new LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });
}
