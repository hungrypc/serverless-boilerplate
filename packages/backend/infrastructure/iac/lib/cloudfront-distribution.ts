// import { ICertificate } from '@aws-cdk/aws-certificatemanager'
// import { Distribution as CdkDistribution } from '@aws-cdk/aws-cloudfront'
// import { S3Origin } from '@aws-cdk/aws-cloudfront-origins'
// import { IBucket } from '@aws-cdk/aws-s3'
// import * as cdk from '@aws-cdk/core'

// export class Distribution extends CdkDistribution {
//   constructor(
//     scope: cdk.Construct,
//     id: string,
//     {
//       domainName,
//       name,
//       certificate,
//       bucket,
//     }: {
//       bucket: IBucket
//       domainName: string
//       name: string
//       certificate: ICertificate
//     },
//   ) {
//     super(scope, id, {
//       defaultBehavior: { origin: new S3Origin(bucket) },
//       domainNames: [`${name}.${domainName}`],
//       certificate,
//     })
//   }
// }
