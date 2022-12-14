import { sign, verify } from 'jsonwebtoken'

import { BaseError, Context, StatusCodes } from '@app/common'
import { ConfigManager } from '@app/config-manager'

class InvalidAuthorizationToken extends BaseError {
  constructor() {
    super(`Received invalid authorization token`, InvalidAuthorizationToken.name, StatusCodes.FORBIDDEN)
  }
}

export type JwtClient = ReturnType<typeof JwtClient>

export const JwtClient = async (context: Context) => {
  const privateKey = await ConfigManager(context).get('JWT_SECRET_KEY')

  return {
    sign: (data: object) => {
      return sign(data, privateKey)
    },
    verify: (token: string) => {
      try {
        return verify(token, privateKey)
      } catch (err) {
        throw new InvalidAuthorizationToken()
      }
    },
  }
}
