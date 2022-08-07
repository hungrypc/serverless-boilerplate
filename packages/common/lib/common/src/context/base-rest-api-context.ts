import { Context, Request, Response } from '../'

export interface BaseRestApiContext extends Context {
  request: Request
  response: Response
}
