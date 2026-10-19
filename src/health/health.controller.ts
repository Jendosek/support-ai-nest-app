import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service.js';

@Controller('health') // route prefix -> everything here lives under /health
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get() // GET /health
  async check() {
    const dbUp = await this.healthService.isDatabaseUp();

    const body = {
      status: dbUp ? 'ok' : 'error',
      db: dbUp ? 'ok' : 'down',
      // Seconds since process start: handy to spot crash-restart loops
      // (uptime keeps resetting to small numbers).
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };

    if (!dbUp) {
      // Built-in Nest exception -> HTTP 503 with our body as JSON.
      // 503 = "temporarily can't serve", exactly what platforms expect.
      throw new ServiceUnavailableException(body);
    }

    // Returning a value from a @Get handler -> HTTP 200 by default.
    return body;
  }
}