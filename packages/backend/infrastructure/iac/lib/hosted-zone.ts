import * as route53 from '@aws-cdk/aws-route53'
import * as cdk from '@aws-cdk/core'

export class HostedZone extends cdk.Construct {
  public hostedZone: route53.IHostedZone

  constructor(scope: cdk.Construct, id: string, context: { stage: string }, { domainName }: { domainName: string }) {
    super(scope, id)

    this.hostedZone =
      context.stage === 'production'
        ? route53.HostedZone.fromLookup(this, 'hosted-zone', { domainName })
        : new route53.HostedZone(this, 'hosted-zone', { zoneName: domainName })

    new cdk.CfnOutput(scope, `${context.stage}-domain-name`, {
      exportName: `${context.stage}-domain-name`,
      value: domainName,
    })

    new cdk.CfnOutput(this, `${context.stage}-hosted-zone-id`, {
      exportName: `${context.stage}-hosted-zone-id`,
      value: this.hostedZone.hostedZoneId,
    })
  }
}
