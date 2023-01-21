import { Table, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class DynamoDbStack extends Construct {
  readonly table: ITable;

  readonly accessTablePolicy: PolicyStatement;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = Table.fromTableName(this, 'first-bot-table', 'dev-Table');

    this.accessTablePolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'dynamodb:GetItem',
        'dynamodb:Query',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
      ],
      resources: [this.table.tableArn],
    });
  }
}
