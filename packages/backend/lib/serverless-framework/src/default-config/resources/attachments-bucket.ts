import { BASE_DOMAIN } from '../../get-default-config'

export const attachmentsBucket = ({ stage, bucketName }: { stage: string; bucketName: string }) => ({
  AttachmentsBucket: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      BucketName: bucketName,
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedOrigins: [
              `*.${BASE_DOMAIN}`,
              ...(['staging', 'production'].includes(stage) ? [] : ['http://localhost:3000']),
            ],
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'POST'],
            MaxAge: 3000,
          },
        ],
      },
    },
  },
})
