import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter, LoggingInterceptor } from './common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  logger.log('Starting GestCard application...');

  const app = await NestFactory.create(AppModule);

  logger.log('Application instance created');

  // Configurar filtro global de excepciones
  app.useGlobalFilters(new AllExceptionsFilter());
  logger.log('Global exception filter configured');

  // Configurar interceptor global de logging
  app.useGlobalInterceptors(new LoggingInterceptor());
  logger.log('Global logging interceptor configured');

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  logger.log('Global validation pipe configured');

  // Configurar CORS
  app.enableCors();
  logger.log('CORS enabled');

  // Configurar prefijo global
  app.setGlobalPrefix('api/v1');
  logger.log('Global prefix set to api/v1');

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('GestCard API')
    .setDescription('API para el sistema de gestión de tarjetas GestCard')
    .setVersion('1.0')
    .addTag('auth', 'Endpoints de autenticación y autorización')
    .addTag('candidates', 'Endpoints de gestión de candidatos')
    .addTag('job-offers', 'Endpoints de gestión de ofertas laborales')
    .addTag('skills', 'Endpoints de gestión de habilidades')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'GestCard API Documentation',
  });

  logger.log('Swagger documentation configured');

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 Swagger documentation: http://localhost:${port}/api/v1/docs`);
  logger.log('GestCard application started successfully!');
}

void bootstrap();
