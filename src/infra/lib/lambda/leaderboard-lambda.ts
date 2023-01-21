import { Construct } from 'constructs';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { BaseLambda } from './base-lambda';

export class LeaderboardLambda extends BaseLambda {
  constructor(scope: Construct, id: string, layers?: LayerVersion[]) {
    super('Leaderboard', 'leaderboard', scope, id, layers);
  }
}
