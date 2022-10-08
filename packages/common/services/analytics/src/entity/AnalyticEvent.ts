export enum AnalyticEventType {
  PAGE_VIEW = 'PAGE_VIEW',
}

export type AnalyticEvent = {
  domain: string
  eventType: AnalyticEventType
  referer: string
  url: string
  clientWidth: number
}
