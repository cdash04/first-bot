import { Construct } from 'constructs';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { BaseLambda } from './base-lambda';

export class OfflineEventLambda extends BaseLambda {
  constructor(scope: Construct, id: string, layers?: LayerVersion[]) {
    super('OfflineEvent', 'offline-event', scope, id, layers);
  }
}
