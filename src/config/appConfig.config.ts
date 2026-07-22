import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  apiVersion: process.env.API_VERSION,
  awsBucketName: process.env.AWS_BUCKET_NAME || process.env.AWS_BUCKETNAME,
  awsCloudFrontUrl:
    process.env.AWS_CLOUDFRONT_URL || process.env.AWS_CLOUD_FRONT_URL,
  awsRegion: process.env.AWS_REGION,
  awsClientKey: process.env.AWS_ACCESS_KEY || process.env.AWS_CLIENT_KEY,
  awsSecretKey: process.env.AWS_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY,

  //mail
  mailHost: process.env.MAIL_HOST,
  mailPort: Number(process.env.MAIL_PORT),
  smtpUserName: process.env.SMTP_USERNAME,
  smtpPassword: process.env.SMTP_PASSWORD,
}));
