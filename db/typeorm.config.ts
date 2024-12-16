import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('MYSQL_HOST') || 'mysql_db',
  port: configService.get('MYSQL_TCP_PORT'),
  database: configService.get('MYSQL_DATABASE'),
  username: configService.get('MYSQL_USER'),
  password: configService.get('MYSQL_PASSWORD'),
  entities: [`${__dirname}/../src/**/*.entity.{ts,js}`],
  synchronize: configService.get('NODE_ENV') === 'development',
  logging: configService.get('NODE_ENV') === 'development',
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  migrationsTableName: 'migrations',
  namingStrategy: new SnakeNamingStrategy(),
});

// npm run migration:generate --db/migrations/Latest
// npm run migration:run
