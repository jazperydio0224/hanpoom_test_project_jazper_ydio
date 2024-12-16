import { registerAs } from '@nestjs/config';
import { config } from 'dotenv';

config();

export default registerAs('config', () => ({
  port: parseInt(process.env.MYSQL_TCP_PORT, 10) || 3000,
  nodenv: process.env.NODE_ENV,
}));
