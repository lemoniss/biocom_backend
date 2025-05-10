import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // 👈 여기에 로그 옵션 추가
    });
  }
  
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
  
}