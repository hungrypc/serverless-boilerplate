import { Provider } from 'serverless/aws'

import { merge } from '@app/lodash'
import { DeepPartial } from '@app/ts-utils'

import { Serverless } from '../types'
import { base } from './base'
import { eventPublisher, lambda, ssm } from './permissions'

type RestApiArgs = {
  serviceName: string
  stage: string
  monitored?: boolean
}

export const restApi = ({ stage, serviceName, monitored = true }: RestApiArgs): Serverless => {
  const defaultRestApiConfig: DeepPartial<Provider> = {
    timeout: 30,
    apiGateway: {
      restApiId: {
        'Fn::ImportValue': `${stage}-rest-api-id`,
      } as any,
      restApiRootResourceId: {
        'Fn::ImportValue': `${stage}-rest-api-root-resource-id`,
      } as any,
    },
    iamRoleStatements: [eventPublisher, ssm, lambda],
    stackTags: {
      ...(monitored ? { monitored: 'monitored' } : {}),
    },
  }

  return merge(base({ stage, serviceName }), { provider: defaultRestApiConfig })
}
