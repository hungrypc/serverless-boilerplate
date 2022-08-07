export const authApiAuthorizer = {
  authorizer: {
    type: 'CUSTOM',
    authorizerId: {
      'Fn::ImportValue': '${self:custom.stage}-api-gateway-authorizer',
    },
  },
}
