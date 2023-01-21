import { Construct } from 'constructs';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { BaseLambda } from './base-lambda';

export class PayToWinLambda extends BaseLambda {
  constructor(scope: Construct, id: string, layers?: LayerVersion[]) {
    super('PayToWin', 'pay-to-win', scope, id, layers);
  }
}
