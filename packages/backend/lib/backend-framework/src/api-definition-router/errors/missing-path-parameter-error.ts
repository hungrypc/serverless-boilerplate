import { BaseError, StatusCodes } from '@app/common'

export class MissingPathParameterError extends BaseError {
  constructor(key: string) {
    super(`MissingPathParameter ${key}`, MissingPathParameterError.name, StatusCodes.BAD_REQUEST)
  }
}
