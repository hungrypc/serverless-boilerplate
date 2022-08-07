import { BaseDictionary } from './dictionary'
import { StatusCodes } from './http'

export class BaseError extends Error {
  errorCode: string

  constructor(
    public message: string,
    public name: string,
    public statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    public meta: unknown = {},
  ) {
    super(message)
    this.name = name
    this.errorCode = name
  }

  toDict(): BaseDictionary {
    return {
      message: this.message,
      errorCode: this.name,
      statusCode: this.statusCode,
      meta: this.meta,
    }
  }
}
