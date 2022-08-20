import { AuthLevel } from './auth-level'

type Props = {
  name: string
  prefix?: AuthLevel
  plural?: string
}

type Scope = {
  type: string
  id: string
}

const generateApiPath = ({ name, prefix, ...props }: Props) => {
  const singular = name
  const { plural = `${singular}s` } = props
  const urlPrefix = prefix ? `/${prefix}` : ''

  const buildScope = (type = ':scopeType', id = ':scopeId') => `${type}${id ? `/${id}` : ''}`
  const buildScopes = (scopes: Scope[]) => scopes.map(scope => buildScope(scope.type, scope.id)).join('/')

  const buildPaths = (suffix: string) => ({
    base: () => `${urlPrefix}/${suffix}`,
    withId: (id: string) => `${urlPrefix}/${suffix}/${id}`,
    withScope: (type = ':scopeType', id = ':scopeId') => `${urlPrefix}/${buildScope(type, id)}/${suffix}`,
    withScopeAndId: (type = ':scopeType', scopeId = ':scopeId', id: string) =>
      `${urlPrefix}/${buildScope(type, scopeId)}/${suffix}/${id}`,
    withScopes: (scopes: Scope[]) => `${urlPrefix}/${buildScopes(scopes)}/${suffix}`,
  })

  return {
    all: buildPaths(plural),
    one: buildPaths(singular),
  }
}

export { generateApiPath }
