import { isArray } from '@app/lodash'

import { AwsFunctionHandler } from '../../types'

export const eventBridgeFunction = ({
  functionName,
  handler,
  eventTypes,
}: {
  functionName: string
  handler: string
  eventTypes: {
    context: string | string[]
    entity: string | string[]
    type: string | string[]
  }[]
}): Record<typeof functionName, AwsFunctionHandler> => {
  return {
    [functionName]: {
      name: `\${self:provider.stackName}-${functionName}`,
      handler,
      events: eventTypes.map(({ context, entity, type }) => ({
        eventBridge: {
          eventBus: 'arn:aws:events:us-east-1:872896368880:event-bus/${self:custom.stage}',
          pattern: {
            detail: {
              context: isArray(context) ? context : [context],
              entity: isArray(entity) ? entity : [entity],
              type: isArray(type) ? type : [type],
            },
          },
        },
      })),
    },
  }
}
