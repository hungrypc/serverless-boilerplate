# serverless boilerplate: backend

personal monorepo boilerplate, but only the backend impl. here (+ common folder to share types between FE and BE if FE is added in later on)

used to set up an api (currently for personal use rn so everything is set up to play around with on my own domain)

made with (event-driven) microservice architecture in mind, iac

- using aws-cdk to first build initial infrastructure
  + creates event bus
  + creates s3 deployment bucket
  + sets up rest api on api-gateway with custom domain name mapped
    - creates new A record for api domain, uses custom domain certificate (should be previously set up)
- then using serverless to deploy:
  + custom api-gateway authorizer lambda to handle authenticating requests
  + per service lambdas generated with configurable [`generateServerlessRestApiConfig`](https://github.com/hungrypc/serverless-boilerplate-backend/blob/master/packages/backend/lib/serverless-framework/src/generate-serverless-config.ts)

each service can set up:
1. authenticated api
2. public api
3. event bridge

## stack
- [ts](https://www.typescriptlang.org/)
- [aws-cdk](https://github.com/aws/aws-cdk)
- [serverless](https://www.serverless.com/)

## todo
- remove serverless-plugin-monorepo
- cli script to deploy all services
- add testing
- ci/cd?

## notes
- ssm paramstore
- using serverless-webpack to optimize lambda packages
  + custom plugin, pkg-up and webpack @ specific versions, build first
- because main domain is currently hosted on vercel, had to add CNAME dns record for api route on vercel to fix dns resolution issues
