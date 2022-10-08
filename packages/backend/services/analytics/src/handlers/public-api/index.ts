import { RestApiRouter } from '@app/backend-framework'

import { config } from '../../config'
import * as Controllers from './controllers'

export const publicApi = RestApiRouter({
  context: config,
  prefix: 'public',
  controllers: Object.values(Controllers),
})
