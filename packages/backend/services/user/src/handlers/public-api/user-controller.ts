import { Args, Controller, RestApiContext, Route, ServiceReturnType } from '@app/backend-framework'
import { PublicApi } from '@app/user-shared'

import { UserService } from '../../services'

const { routes } = PublicApi

export class UserController extends Controller {
  private service!: ServiceReturnType<typeof UserService, 'auth'>

  async initialize(context: RestApiContext) {
    super.initialize(context)
    this.service = await UserService(context).then(s => s.auth())
  }

  @Route(routes.testPublicApi)
  async testApi({ pathParams: { userId } }: Args<typeof routes.testPublicApi>) {
    return this.service.testApi({ userId, api: 'public' })
  }
}
