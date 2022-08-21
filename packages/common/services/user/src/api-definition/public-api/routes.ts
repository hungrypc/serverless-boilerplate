import { HttpMethod } from '@app/common'

import { paths } from './paths'
import { byUserId } from './schemas'

export const routes = {
  testPublicApi: {
    path: paths.user.all.withId(':userId'),
    method: HttpMethod.GET,
    authenticated: false,
    pathParamsValidator: (params: unknown) => byUserId.validate(params),
    responseValidator: (response: unknown) => Promise.resolve(response as string),
  },
}
