import { RestApiContext } from '../rest-api-context'

export function responseLogFormatter(context: RestApiContext): string {
  return ` with status code ${context.response.statusCode}`
}
