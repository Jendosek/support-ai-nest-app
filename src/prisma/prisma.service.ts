import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js'; // NOT '@prisma/client' in v7

@Injectable()
export class PrismaService
  extends PrismaClient // inherit -> this.prisma.user.findMany() works directly on the service
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    // getOrThrow: if DATABASE_URL is missing, app fails at startup, not on first request
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
    });
    super({ adapter }); // must be called before using `this`
  }

  async onModuleInit() {
    // Prisma connects lazily by default; connecting here surfaces bad config immediately
    await this.$connect();
  }

  async onModuleDestroy() {
    // closes the pg connection pool on shutdown (otherwise connections may hang)
    await this.$disconnect();
  }
}