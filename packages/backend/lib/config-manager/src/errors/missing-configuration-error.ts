export class MissingConfigurationError extends Error {
  public constructor(configuration: string) {
    super(`Environment variable ${configuration} missing.`)
    this.name = 'MissingConfigurationError'
  }
}
