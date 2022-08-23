import { Args, Controller, RestApiContext, Route, ServiceReturnType } from '@app/backend-framework'
import { AuthenticatedApi } from '@app/user-shared'

import { UserService } from '../../services'

const { routes } = AuthenticatedApi

export class UserController extends Controller {
  private service!: ServiceReturnType<typeof UserService, 'auth'>

  async initialize(context: RestApiContext) {
    super.initialize(context)
    this.service = await UserService(context).then(s => s.auth())
  }

  @Route(routes.testAuthApi)
  async testAuthApi({ payload: { userId } }: Args<typeof routes.testAuthApi>) {
    return this.service.testAuthApi({ userId })
  }
}
