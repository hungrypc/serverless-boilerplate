import { sign, verify } from 'jsonwebtoken'

import { BaseError, StatusCodes } from '@app/common'

class InvalidAuthorizationToken extends BaseError {
  constructor() {
    super(`Received invalid authorization token`, InvalidAuthorizationToken.name, StatusCodes.FORBIDDEN)
  }
}

export type JwtClient = ReturnType<typeof jwtClient>

export const jwtClient = () => {
  const privateKey = process.env.JWT_SECRET

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
