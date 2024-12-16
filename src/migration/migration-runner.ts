import { NestFactory } from '@nestjs/core';
import { MigrationModule } from './migration.module';
import { MigrationService } from './migration.service';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const migrationService = app.get(MigrationService);
  await migrationService.migrateData();
  await app.close();
}

bootstrap();
