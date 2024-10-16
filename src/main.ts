import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "https://gym-pro-api.vercel.app/",
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    credentials: true
  });

  const config = new DocumentBuilder()
    .setTitle('ADM GYM PRO')
    .setDescription('API para gerenciar membros de academia, planos de assinatura e gerar recibos de pagamento, permitindo interações e rastreamento eficiente de membros e transações.')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  await app.listen(3001);
}
bootstrap();
