export const attachmentsBucket = (bucketName: string) => ({
  AttachmentsBucket: {
    Type: 'AWS::S3::Bucket',
    Properties: {
      BucketName: bucketName,
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedOrigins: ['*.philip-chan.me'],
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'POST'],
            MaxAge: 3000,
          },
        ],
      },
    },
  },
})
