import { NestFactory, Reflector } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PoliciesGuard } from './common/modules/casl';
import { CaslAbilityFactory } from './common/modules/casl';
import { JwtAuthGuard, ProfileCompletionGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });

  // Use Pino logger
  app.useLogger(app.get(Logger));

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global guards - JWT Auth, CASL Authorization, and Profile Completion
  const reflector = app.get(Reflector);
  const caslAbilityFactory = app.get(CaslAbilityFactory);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PoliciesGuard(reflector, caslAbilityFactory),
    new ProfileCompletionGuard(reflector),
  );

  // Global prefix for all routes
  app.setGlobalPrefix('api/v1');

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Matrimony Backend API')
    .setDescription('API documentation for Matrimony Backend')
    .setVersion('1.0')
    .addTag('matrimony')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
