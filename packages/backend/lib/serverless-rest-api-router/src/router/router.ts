import { match, pathToRegexp } from 'path-to-regexp'

import { HttpMethod } from '@app/common'

import { Route } from './route'

const sanitizePath = (str: string) => {
  return str.startsWith('/') ? str : `/${str}`
}

export function Router<T extends Route>({ routes, prefix }: { routes: T[]; prefix?: string }) {
  return {
    match: (request: { method: HttpMethod; url: string }): { route: T; params: { [key: string]: string } } => {
      const prefixedRequestUrl = prefix ? `/${prefix}${request.url}` : request.url

      const route = routes.find(
        (route: T) =>
          route.method.toLowerCase() === request.method.toLowerCase() &&
          pathToRegexp(sanitizePath(route.path)).exec(sanitizePath(prefixedRequestUrl)),
      )

      if (!route) {
        return
      }

      return {
        route,
        params: (match(sanitizePath(route.path))(sanitizePath(prefixedRequestUrl)) as any)?.params,
      }
    },
  }
}
