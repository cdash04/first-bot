import { Table, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { IGrantable, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class DynamoDbStack extends Construct {
  readonly table: ITable;

  readonly accessTablePolicy: PolicyStatement;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = Table.fromTableName(this, 'first-bot-table', 'dev-Table');
  }

  grantReadWriteAccess(grantees: IGrantable[]) {
    grantees.forEach((grantee) => this.table?.grantReadWriteData(grantee));
  }
}
