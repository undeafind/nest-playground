import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'production',
  apiVersion: process.env.API_VERSION,
}));
