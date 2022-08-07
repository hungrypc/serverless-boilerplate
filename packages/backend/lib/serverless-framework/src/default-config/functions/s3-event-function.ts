import { AwsFunctionHandler } from '../../types'

export const s3EventFunction = ({
  functionName,
  handler,
  eventTypes,
  bucketName,
}: {
  functionName: string
  handler: string
  eventTypes: string[]
  bucketName: string
}): Record<typeof functionName, AwsFunctionHandler> => {
  return {
    [functionName]: {
      name: `\${self:provider.stackName}-${functionName}`,
      handler,
      events: eventTypes.map(eventName => ({
        s3: {
          bucket: bucketName,
          existing: true,
          event: `s3:${eventName}:*`,
        },
      })),
    },
  }
}
