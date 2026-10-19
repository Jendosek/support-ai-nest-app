import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { PrismaModule } from './prisma/prisma.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { LlmModule } from './llm/llm.module.js';
import { KnowledgeModule } from './knowledge/knowledge.module.js';
import { ToolsModule } from './tools/tools.module.js';
import { ConversationsModule } from './conversations/conversations.module.js';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'support-ai-nest-app',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    TicketsModule,
    LlmModule,
    KnowledgeModule,
    ToolsModule,
    ConversationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
