import { registerAs } from '@nestjs/config';

export default registerAs('appConfig', () => ({
  apiVersion: process.env.API_VERSION,
  awsBucketName: process.env.AWS_BUCKET_NAME,
  awsCloudFrontUrl: process.env.AWS_CLOUD_FRONT_URL,
  awsRegion: process.env.AWS_REGION,
  awsClientKey: process.env.AWS_CLIENT_KEY,
  awsSecretKey: process.env.AWS_SECRET_KEY,
}));
