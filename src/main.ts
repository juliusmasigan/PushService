import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { JwtWebsocketAdapter } from './jwt-websocket.adapter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  if (eval(config.get('CORS_ENABLED'))) {
    app.enableCors();
  }
  app.useWebSocketAdapter(new JwtWebsocketAdapter(app));
  await app.listen(config.get('APP_PORT'));
}
bootstrap();
