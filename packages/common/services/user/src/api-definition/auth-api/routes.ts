import { HttpMethod } from '@app/common'

import { paths } from './paths'
import { byUserId } from './schemas'

const BASE_USER_URL = paths.user.all.base()

export const routes = {
  testAuthApi: {
    path: BASE_USER_URL,
    method: HttpMethod.POST,
    authenticated: true,
    payloadValidator: (payload: unknown) => byUserId.validate(payload),
    responseValidator: (response: unknown) => Promise.resolve(response as string),
  },
}
