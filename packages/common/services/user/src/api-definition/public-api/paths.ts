import { AuthLevel, generateApiPath } from '@app/backend-framework'

const paths = {
  user: generateApiPath({ prefix: AuthLevel.PUBLIC, name: 'user' }),
}

export { paths }
