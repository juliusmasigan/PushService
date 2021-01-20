import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { NotificationModule } from './notification.module';
import { NotificationService } from './notification.service';
import { INestApplication } from '@nestjs/common';

describe('Notification', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [NotificationModule]
    })
      .overrideProvider(NotificationService)
      .useValue({ get: () => null })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/GET notification', () => {
    return request(app.getHttpServer())
      .get('/notification')
      .expect(200)
      .expect([]);
  });

  afterAll(async () => {
    app.close();
  })
});
