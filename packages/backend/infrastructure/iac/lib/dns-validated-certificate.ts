import * as certificatemanager from '@aws-cdk/aws-certificatemanager'
import * as route53 from '@aws-cdk/aws-route53'
import * as cdk from '@aws-cdk/core'

interface DnsValidatedCertificateProps {
  domainName: string
  hostedZone: route53.IHostedZone
}

export class DnsValidatedCertificate extends certificatemanager.DnsValidatedCertificate {
  constructor(
    scope: cdk.Construct,
    id: string,
    context: { stage: string; orgName: string },
    { domainName, hostedZone }: DnsValidatedCertificateProps,
  ) {
    super(scope, id, {
      domainName,
      subjectAlternativeNames: [`*.${domainName}`],
      hostedZone,
    })

    new cdk.CfnOutput(this, `${context.stage}-certificate-arn`, {
      exportName: `${context.stage}-certificate-arn`,
      value: this.certificateArn,
    })
  }
}
