import * as cdk from '@aws-cdk/core'

import { getConfig } from './config'
import { Context } from './context'
import { DnsValidatedCertificate } from './dns-validated-certificate'
import { EventBus } from './event-bus'
import { HostedZone } from './hosted-zone'
import { RestApi } from './rest-api'
import { DeploymentBucket } from './s3-bucket'

export class IacStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, context: Context) {
    super(scope, id, { env: { region: context.region, account: context.account } })
    const config = getConfig(context.stage)

    const { domainName } = config

    new EventBus(this, 'event-bus', context)
    new DeploymentBucket(this, 'deployment-bucket', context)
    const { hostedZone } = new HostedZone(this, 'hosted-zone', context, { domainName })
    const certificate = new DnsValidatedCertificate(this, 'certificate', context, { domainName, hostedZone })

    new RestApi(this, 'rest-api', context, {
      certificate,
      hostedZone,
      domainName: config.apiGateway.restApiDomainName,
      apiPrefix: config.apiPrefix,
    })
  }
}
