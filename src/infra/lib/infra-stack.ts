import { Stack, StackProps } from 'aws-cdk-lib';
import { CfnInclude } from 'aws-cdk-lib/cloudformation-include';
import { Construct } from 'constructs';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const cfnInclude = new CfnInclude(this, 'Template', {
      templateFile: 'src/infra/resources/template.json',
    });
  }
}
