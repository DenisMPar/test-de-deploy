import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Create pipes for security management
  app.useGlobalPipes(
    new ValidationPipe({
      //Use transform to transfor entrydata in DTO associated class
      transform: true,
      //Use whitelist to clear unnecesary or unsafe entry information
      whitelist: true,
    }),
  );
  app.enableCors();
  // Stablish the connection port
<<<<<<< HEAD
  await app.listen(PORT);
=======
  await app.listen(process.env.PORT);
>>>>>>> 5257cca42ca0a10533f7db1a30ddd9b65b651eb5
}
bootstrap();
