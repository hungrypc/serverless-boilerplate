import { RestApiContext } from '../rest-api-context'

export function requestLogFormatter(context: RestApiContext): string {
  return `request ${context.request.method} ${context.request.url}`
}
