import { Construct } from 'constructs';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { BaseLambda } from './base-lambda';

export class OnlineEventLambda extends BaseLambda {
  constructor(scope: Construct, id: string, layers?: LayerVersion[]) {
    super('OnlineEvent', 'online-event', scope, id, layers);
  }
}
