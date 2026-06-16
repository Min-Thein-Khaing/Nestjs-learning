import { registerAs } from '@nestjs/config';
export default registerAs('authConfig', () => ({
  fallbackUrl: process.env.AUTH_FALLBACK_URL,
}));
