import { BaseError, StatusCodes } from '@app/common'

import { RestApiContext } from '../rest-api'

export default class PayloadValidationError extends BaseError {
  constructor(error: Error) {
    super(`Invalid payload ${error}`, PayloadValidationError.name, StatusCodes.UNPROCESSABLE_ENTITY, error)
  }
}

export async function handlePayloadValidationError(_: RestApiContext, next: Function): Promise<void> {
  try {
    await next()
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new PayloadValidationError(error)
    }

    throw error
  }
}
