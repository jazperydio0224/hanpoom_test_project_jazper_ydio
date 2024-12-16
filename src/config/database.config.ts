import { registerAs } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';

config();

export default registerAs('database', () => ({
  type: 'mysql',
  host: process.env.MYSQL_HOST || 'mysql_db',
  port: parseInt(process.env.MYSQL_TCP_PORT, 10) || 3307,
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  entities: [`${__dirname}/../**/*.entity.{ts,js}`],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrations: [`${__dirname}/../../db/migrations/*.{ts,js}`],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
}));
