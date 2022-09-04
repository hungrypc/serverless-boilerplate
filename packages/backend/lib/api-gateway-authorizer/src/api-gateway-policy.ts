export interface Statement {
  Action: 'execute-api:Invoke'
  Effect: string
  Resource: unknown
}

export interface BasePolicy {
  principalId?: string
  policyDocument: {
    Version: '2012-10-17'
    Statement: Statement[]
  }
}

export const generateBasePolicy = (effect: string): BasePolicy => {
  return {
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: '*',
        },
      ],
    },
  }
}
