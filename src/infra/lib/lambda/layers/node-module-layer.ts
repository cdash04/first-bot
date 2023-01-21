import { Code, LayerVersion, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class NodeModuleLayer extends Construct {
  readonly layer: LayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.layer = new LayerVersion(this, 'node-module-layer', {
      compatibleRuntimes: [Runtime.NODEJS_16_X],
      code: Code.fromAsset('node_modules'),
      description: 'node_modules',
    });
  }
}
