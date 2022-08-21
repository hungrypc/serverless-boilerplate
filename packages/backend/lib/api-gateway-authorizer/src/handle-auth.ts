import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda'

import { headerManager } from '@app/common'
import { jwtClient } from '@app/jwt'
import { InvocationContext } from '@app/serverless-function'

import { BasePolicy, generateBasePolicy } from './api-gateway-policy'

export interface ApiGatewayPolicy extends BasePolicy {}

export const generatePolicy = (effect: string) => {
  return {
    ...generateBasePolicy(effect),
    principalId: 'a',
  }
}

export const verifyAuthenticationAndGetPolicy = async (
  context: InvocationContext<APIGatewayRequestAuthorizerEvent>,
): Promise<ApiGatewayPolicy> => {
  const headerToken = headerManager.authorizationBearer.parse(context.awsEvent.headers)
  const queryStringToken = context.awsEvent.queryStringParameters?.authToken

  const parsed = jwtClient().verify(headerToken ?? queryStringToken)

  if (parsed) {
    return generatePolicy('Allow')
  } else {
    return generatePolicy('Deny')
  }
}
