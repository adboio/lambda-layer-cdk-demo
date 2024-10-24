import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dotenv from 'dotenv';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export const ACCOUNT_ID = 'MY_ACCOUNT_ID';

export class MyCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // this is messy for development :P
    dotenv.config({ path: ['../../.env', '../.env', '.env'] });

    // pull in the new deployment ID to bake into the asset filenames, which forces an udpate
    const deploymentIdParam = new cdk.CfnParameter(this, 'rbDeploymentId', {
      type: 'String'
    });

    // create assets bucket
    const assetsBucket = new s3.Bucket(this, 'my-cdk-assets-bucket', {
      bucketName: 'my-cdk-assets'
    })

    // create layer
    // this pulls in everything from layer/shared, AND all dependencies from requirements.txt
    const sharedLayer = new lambda.LayerVersion(this, 'MyAssetsLayer', {
      code: lambda.Code.fromBucket(assetsBucket, `layer/${deploymentIdParam.valueAsString}.zip`),
      description: `deployed at ${Date.now()}`
    })

    // create lambda with the layer
    const myLambda = new lambda.Function(this, 'MyLambda', {
      functionName: 'MyLambda',
      runtime: lambda.Runtime.PYTHON_3_12,
      code: lambda.Code.fromBucket(assetsBucket, `functions/${deploymentIdParam.valueAsString}.zip`),
      description: `deployed at ${Date.now()}`,
      handler: 'functions.hello_world.handler.handler',
      layers: [ sharedLayer ],
      timeout: cdk.Duration.seconds(90)
    })
  }
}
