import {
  AwsFunction as BaseAwsFunction,
  Detail,
  Event as BaseEvent,
  EventBridge as BaseEventBridge,
  PatternExisting,
} from 'serverless/aws'

interface PatternInput {
  source?: string[]
  'detail-type'?: string[]
  detail: Detail
}

interface EventBridge extends Omit<BaseEventBridge, 'pattern'> {
  pattern?: PatternExisting | PatternInput
}

interface Event extends Omit<BaseEvent, 'eventBridge'> {
  eventBridge?: EventBridge
}

interface AwsFunction extends Omit<BaseAwsFunction, 'events'> {
  events?: Event[]
}

export interface AwsFunctionHandler extends AwsFunction {
  handler: string
}
