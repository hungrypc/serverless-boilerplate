export interface Context {
  stage: string
  serviceName: string
  correlatedRequestId?: string
  response?: unknown
}
