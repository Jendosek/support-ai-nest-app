import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Global() // almost every feature module needs DB → import once in AppModule instead of everywhere
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // without export, other modules can't inject it
})
export class PrismaModule {}