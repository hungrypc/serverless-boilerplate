import { BaseError, StatusCodes } from '@app/common'

export class RouteNotFoundError extends BaseError {
  constructor() {
    super(`Route not found`, RouteNotFoundError.name, StatusCodes.NOT_FOUND)
  }
}
