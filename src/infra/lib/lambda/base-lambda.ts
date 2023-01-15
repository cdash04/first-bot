/* eslint-disable @typescript-eslint/ban-types */
import {
  Code,
  Function,
  IFunction,
  LayerVersion,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class BaseLambda extends Construct {
  readonly lambdaCodeDirectory = 'dist/functions';

  readonly handler: IFunction;

  constructor(
    name: string,
    handler: string,
    scope: Construct,
    id: string,
    layers?: LayerVersion[],
  ) {
    super(scope, id);

    this.handler = new Function(this, `${name}-handler`, {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset(this.lambdaCodeDirectory),
      handler,
      environment: {
        TABLE_NAME: `${process.env.NODE_ENV}-Table`,
        TWITCH_EVENT_SUB_LISTENER_SECRET:
          process.env.TWITCH_EVENT_SUB_LISTENER_SECRET,
      },
      layers,
    });
  }
}
