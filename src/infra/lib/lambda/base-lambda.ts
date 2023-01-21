/* eslint-disable @typescript-eslint/ban-types */
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {
  Code,
  Function,
  IFunction,
  LayerVersion,
  Runtime,
} from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class BaseLambda extends Construct {
  readonly lambdaCodeDirectory = 'dist/functions';

  readonly handler: IFunction;

  constructor(
    name: string,
    file: string,
    scope: Construct,
    id: string,
    layers: LayerVersion[] = [],
  ) {
    super(scope, id);

    this.handler = new NodejsFunction(this, `${name}-handler`, {
      runtime: Runtime.NODEJS_16_X,
      entry: `${this.lambdaCodeDirectory}/${file}.js`,
      environment: {
        TABLE_NAME: 'dev-Table',
        TWITCH_EVENT_SUB_LISTENER_SECRET:
          process.env.TWITCH_EVENT_SUB_LISTENER_SECRET,
      },
      layers,
    });
  }

  addPolicy(policy: PolicyStatement) {
    this.handler.addToRolePolicy(policy);
  }
}
