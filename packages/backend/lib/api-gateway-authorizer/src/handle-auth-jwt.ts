import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda'

import { headerManager } from '@app/common'
import { jwtClient } from '@app/jwt'
import { InvocationContext } from '@app/serverless-function'

import { BasePolicy, generateBasePolicy } from './api-gateway-policy'

export interface JwtApiGatewayPolicy extends BasePolicy {}

export const generateJwtPolicy = (effect: string): JwtApiGatewayPolicy => {
  return generateBasePolicy(effect)
}

export const verifyJwtAuthenticationAndGetPolicy = async (
  context: InvocationContext<APIGatewayRequestAuthorizerEvent>,
): Promise<JwtApiGatewayPolicy> => {
  const headerToken = headerManager.authorizationBearer.parse(context.awsEvent.headers)
  const queryStringToken = context.awsEvent.queryStringParameters?.authToken

  const parsed = jwtClient().verify(headerToken ?? queryStringToken)

  if (parsed) {
    return generateJwtPolicy('Allow')
  } else {
    return generateJwtPolicy('Deny')
  }
}
