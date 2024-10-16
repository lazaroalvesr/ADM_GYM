import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "http://localhost:3001/",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('API de Gestão de Academia')
    .setDescription('API para gerenciar membros, planos e emitir recibos de pagamento.')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(3001);
}
bootstrap();
