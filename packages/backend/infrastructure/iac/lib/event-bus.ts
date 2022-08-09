import * as events from '@aws-cdk/aws-events'
import * as cdk from '@aws-cdk/core'

export class EventBus extends events.EventBus {
  constructor(scope: cdk.Construct, id: string, context: { stage: string }) {
    const eventBusName = context.stage

    super(scope, id, { eventBusName })

    new cdk.CfnOutput(this, `${context.stage}-event-bus-arn`, {
      exportName: `${context.stage}-event-bus-arn`,
      value: this.eventBusArn,
    })
  }
}
