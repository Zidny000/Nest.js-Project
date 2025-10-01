import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipe
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true, // Strip properties that do not have any decorators
  //   forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
  //   transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
  //   disableErrorMessages: false, // Disable detailed error messages in production for security reasons
  // }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
