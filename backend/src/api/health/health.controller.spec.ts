import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';

describe('HealthController (JWT Guard Integration)', () => {
  let app: INestApplication;
  let validToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    // Get a valid token for tests
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'password123',
      });

    validToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health/public', () => {
    it('should return 200 without JWT', async () => {
      const response = await request(app.getHttpServer())
        .get('/health/public')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('public', true);
    });
  });

  describe('GET /health (protected)', () => {
    it('should return 200 with valid JWT', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', 'user-1');
      expect(response.body.user).toHaveProperty('email', 'admin@example.com');
    });

    it('should return 401 without JWT', async () => {
      await request(app.getHttpServer()).get('/health').expect(401);
    });

    it('should return 401 with invalid JWT', async () => {
      await request(app.getHttpServer())
        .get('/health')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });

    it('should return 401 with malformed Authorization header', async () => {
      await request(app.getHttpServer())
        .get('/health')
        .set('Authorization', 'InvalidFormat')
        .expect(401);
    });
  });
});
