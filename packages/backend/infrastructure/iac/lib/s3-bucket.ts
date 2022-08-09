import { CfnBucket } from '@aws-cdk/aws-s3'
import * as cdk from '@aws-cdk/core'

export class S3Bucket extends CfnBucket {
  constructor(
    scope: cdk.Construct,
    id: string,
    context: { stage: string; orgName: string },
    { name }: { name: string },
  ) {
    const bucketName = `${context.orgName}-${context.stage}-${name}`

    super(scope, id, {
      bucketName,
      accelerateConfiguration: {
        accelerationStatus: 'Enabled',
      },
    })

    new cdk.CfnOutput(this, `${context.stage}-${name}`, {
      exportName: `${context.stage}-${name}`,
      value: bucketName,
    })
  }
}

export class DeploymentBucket extends S3Bucket {
  constructor(scope: cdk.Construct, id: string, context: { stage: string; orgName: string }) {
    super(scope, id, context, { name: 'deployment' })
  }
}
