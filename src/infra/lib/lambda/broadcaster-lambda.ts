import { Construct } from 'constructs';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { BaseLambda } from './base-lambda';

export class BroadcastersLambda extends BaseLambda {
  constructor(scope: Construct, id: string, layers?: LayerVersion[]) {
    super('Broadcaster', 'broadcasters', scope, id, layers);
  }
}
