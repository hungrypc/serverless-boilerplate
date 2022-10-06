import { BASE_DOMAIN } from '../../get-default-config'

/** Currently, must be used with [attachmentsBucket](packages/backend/lib/serverless-framework/src/default-config/resources/attachments-bucket.ts) */
export const cloudfrontDistribution = ({ stage, serviceName }: { stage: string; serviceName: string }) => {
  const alias =
    stage === 'production' ? `${serviceName}-cdn.${BASE_DOMAIN}` : `${serviceName}-cdn.${stage}.${BASE_DOMAIN}`
  return {
    CloudFrontDistribution: {
      Type: 'AWS::CloudFront::Distribution',
      DependsOn: ['AttachmentsBucket'],
      Properties: {
        DistributionConfig: {
          Origins: [
            {
              DomainName: {
                'Fn::GetAtt': ['AttachmentsBucket', 'DomainName'],
              },
              Id: { Ref: 'AttachmentsBucket' },
              S3OriginConfig: {},
            },
          ],
          Aliases: [alias],
          Enabled: true,
          PriceClass: 'PriceClass_All',
          HttpVersion: 'http2',
          DefaultCacheBehavior: {
            Compress: false,
            AllowedMethods: ['GET', 'HEAD'],
            TargetOriginId: { Ref: 'AttachmentsBucket' },
            ForwardedValues: {
              QueryString: 'false',
              Cookies: { Forward: 'none' },
            },
            ViewerProtocolPolicy: 'redirect-to-https',
          },
          ViewerCertificate: {
            AcmCertificateArn: { 'Fn::ImportValue': '${self:custom.stage}-certificate-arn' },
            MinimumProtocolVersion: 'TLSv1.1_2016',
            SslSupportMethod: 'sni-only',
          },
        },
      },
    },
    DistributionHostedZoneRecord: {
      Type: 'AWS::Route53::RecordSetGroup',
      DependsOn: ['CloudFrontDistribution'],
      Properties: {
        HostedZoneId: { 'Fn::ImportValue': '${self:custom.stage}-hosted-zone-id' },
        RecordSets: [
          {
            Name: alias,
            Type: 'A',
            AliasTarget: {
              /**
               * This is always the hosted zone ID when you create an alias record that routes traffic to a CloudFront distribution.
               * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid
               */
              HostedZoneId: 'Z2FDTNDATAQYW2',
              DNSName: { 'Fn::GetAtt': ['CloudFrontDistribution', 'DomainName'] },
            },
          },
        ],
      },
    },
  }
}
