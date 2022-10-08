import { AuthLevel, generateApiPath } from '@app/backend-framework'

const paths = {
  analytics: generateApiPath({ prefix: AuthLevel.PUBLIC, name: 'analytics' }),
}

export { paths }
