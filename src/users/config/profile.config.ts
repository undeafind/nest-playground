import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('profileConfig', () => ({
  apiKey: process.env.PROFILE_API_KEY,
}));
