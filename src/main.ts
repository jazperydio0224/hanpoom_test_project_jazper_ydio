import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT, () => {
    console.log(
      `Running in MODE: ${process.env.NODE_ENV} on Port: ${process.env.PORT}`,
    );
  });
}
bootstrap();
