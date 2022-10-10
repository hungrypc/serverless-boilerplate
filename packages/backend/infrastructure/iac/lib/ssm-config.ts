import { GlobalConfig } from '@app/global-config'
import * as ssm from '@aws-cdk/aws-ssm'
import * as cdk from '@aws-cdk/core'

import { getConfig } from './config'

export class SSMConfig extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, context: { stage: string }) {
    super(scope, id)

    const config = getConfig(context.stage)

    if (config.mongoUrl) {
      new ssm.StringParameter(this, `${context.stage}-ssm-parameter-mongo-url`, {
        stringValue: config.mongoUrl,
        parameterName: `/${context.stage}/global/${GlobalConfig.MONGO_URL}`,
      })

      // if (config.domainName) {
      //   new ssm.StringParameter(this, `${context.stage}-ssm-parameter-webapp-url`, {
      //     stringValue: `${'https://'}${config.domainName}`,
      //     parameterName: `/${context.stage}/global/${GlobalConfig.WEBAPP_URL}`,
      //   })
      // }
    }
  }
}
