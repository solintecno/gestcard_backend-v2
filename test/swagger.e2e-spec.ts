import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Swagger Documentation (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurar Swagger como en main.ts
    const config = new DocumentBuilder()
      .setTitle('GestCard API')
      .setDescription('API para el sistema de gestión de tarjetas GestCard')
      .setVersion('1.0')
      .addTag('auth', 'Endpoints de autenticación y autorización')
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
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should serve Swagger documentation at /api/docs', () => {
    return request(app.getHttpServer())
      .get('/api/docs')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('Swagger UI');
        expect(res.text).toContain('GestCard API');
      });
  });

  it('should serve Swagger JSON at /api/docs-json', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('openapi');
        expect(res.body).toHaveProperty('info');
        expect(res.body.info.title).toBe('GestCard API');
        expect(res.body).toHaveProperty('paths');
        expect(res.body.paths).toHaveProperty('/auth/register');
        expect(res.body.paths).toHaveProperty('/auth/login');
        expect(res.body.paths).toHaveProperty('/auth/profile');
      });
  });

  it('should include auth endpoints in documentation', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200)
      .expect((res) => {
        const paths = res.body.paths;

        // Verificar que todos los endpoints de auth están documentados
        expect(paths['/auth/register']).toBeDefined();
        expect(paths['/auth/login']).toBeDefined();
        expect(paths['/auth/profile']).toBeDefined();
        expect(paths['/auth/admin-only']).toBeDefined();
        expect(paths['/auth/user-info']).toBeDefined();
        expect(paths['/auth/forgot-password']).toBeDefined();
        expect(paths['/auth/reset-password']).toBeDefined();

        // Verificar que incluye métodos correctos
        expect(paths['/auth/register'].post).toBeDefined();
        expect(paths['/auth/login'].post).toBeDefined();
        expect(paths['/auth/profile'].get).toBeDefined();
      });
  });

  it('should include JWT bearer auth configuration', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200)
      .expect((res) => {
        expect(res.body.components).toBeDefined();
        expect(res.body.components.securitySchemes).toBeDefined();
        expect(res.body.components.securitySchemes['JWT-auth']).toBeDefined();
        expect(res.body.components.securitySchemes['JWT-auth'].type).toBe(
          'http',
        );
        expect(res.body.components.securitySchemes['JWT-auth'].scheme).toBe(
          'bearer',
        );
      });
  });

  it('should include proper tags for organization', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200)
      .expect((res) => {
        expect(res.body.tags).toBeDefined();
        const authTag = res.body.tags.find((tag: any) => tag.name === 'auth');
        expect(authTag).toBeDefined();
        expect(authTag.description).toBe(
          'Endpoints de autenticación y autorización',
        );
      });
  });
});
