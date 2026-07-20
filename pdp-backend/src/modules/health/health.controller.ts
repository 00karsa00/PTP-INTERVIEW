import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

/**
 * GET /api/v1/health
 * Liveness check — used by Railway, Render, ngrok health monitors, and CI.
 * Returns 200 immediately — no DB or external calls.
 */
@SkipThrottle()
@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(HttpStatus.OK)
  check() {
    return {
      status: 'ok',
      service: 'Kerala Ayurveda PDP API',
      timestamp: new Date().toISOString(),
    };
  }
}
