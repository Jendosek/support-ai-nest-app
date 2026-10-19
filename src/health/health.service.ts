import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// Health check must answer fast. If DB hangs, we don't want /health to hang too,
// because the platform treats a hanging health check as "dead" anyway, just later.
const DB_CHECK_TIMEOUT_MS = 3000;

@Injectable()
export class HealthService {
  // Logger with class name as context -> logs show "[HealthService] ..."
  private readonly logger = new Logger(HealthService.name);

  // DI: Nest injects PrismaService for us, we never call "new PrismaService()"
  constructor(private readonly prisma: PrismaService) {}

  async isDatabaseUp(): Promise<boolean> {
    try {
      // Tagged template, not a string: Prisma's safe way to run raw SQL.
      // SELECT 1 touches no tables - cheapest possible proof DB is reachable.
      await this.withTimeout(this.prisma.$queryRaw`SELECT 1`, DB_CHECK_TIMEOUT_MS);
      return true;
    } catch (error) {
      // Log full details for us (developers), but never send them to the client:
      // error text may contain host, DB name or other internals.
      this.logger.error(
        'Database health check failed',
        error instanceof Error ? error.stack : String(error),
      );
      return false;
    }
  }

  // Generic helper: reject if the promise doesn't settle in time.
  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timer: NodeJS.Timeout | undefined;

    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms);
    });

    try {
      // Whichever settles first wins: the real query or the timeout.
      return await Promise.race([promise, timeout]);
    } finally {
      // Clear the timer so it doesn't keep running after the query already finished.
      clearTimeout(timer);
    }
  }
}