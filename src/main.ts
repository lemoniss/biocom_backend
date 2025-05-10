import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('SNS + 커머스 API')
    .setDescription('API 명세서입니다')
    .setVersion('1.0')
    .addBearerAuth() // JWT 토큰 전송을 위해 추가
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // ② 필요한 것만 허용(추천)
  app.enableCors({
    origin: [
      'http://localhost:5173',     // 로컬 React dev 서버
      // 'https://front.example.com', // 프로덕션 도메인
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,            // 쿠키/Authorization 헤더 전송 시 true
    maxAge: 3600,                 // preflight 결과 캐시(초)
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
