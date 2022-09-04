import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda'

import { headerManager } from '@app/common'
import { jwtClient } from '@app/jwt'
import { Logger } from '@app/logger'
import { InvocationContext } from '@app/serverless-function'

import { BasePolicy, generateBasePolicy } from './api-gateway-policy'

export interface ApiGatewayPolicy extends BasePolicy {}

export const generatePolicy = (effect: string): ApiGatewayPolicy => {
  return {
    ...generateBasePolicy(effect),
    principalId: 'abc',
  }
}

export const verifyAuthenticationAndGetPolicy = async (
  context: InvocationContext<APIGatewayRequestAuthorizerEvent>,
): Promise<ApiGatewayPolicy> => {
  const logger = Logger(context)
  const jwt = jwtClient()

  const headerToken = headerManager.authorizationBearer.parse(context.awsEvent.headers)
  const queryStringToken = context.awsEvent.queryStringParameters?.authToken

  let policy = 'Deny'
  try {
    const parsed = jwt.verify(headerToken ?? queryStringToken)
    if (parsed) {
      logger.info('Token is valid', { parsed })
      policy = 'Allow'
    }
  } catch (error) {
    if (error.name === 'InvalidAuthorizationToken') {
      logger.warning('Token is invalid, dont let this mf in')
    } else {
      logger.error('Could not verify token due to an unexpected error:', { error })
    }
  }

  logger.info(`Generating policy: ${policy}`)
  return generatePolicy(policy)
}
