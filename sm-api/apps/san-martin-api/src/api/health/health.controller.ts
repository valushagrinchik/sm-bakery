import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import {
  AppConfigService,
  RedisService,
} from '@san-martin/san-martin-libs';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly sequelize: Sequelize,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.0',
    };
  }

  @Get('detailed')
  @ApiOperation({ summary: 'Detailed health check with all services' })
  @ApiResponse({ status: 200, description: 'All services are healthy' })
  @ApiResponse({ status: 503, description: 'Some services are unhealthy' })
  async detailedHealthCheck() {
    const checks = await Promise.allSettled([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkMemory(),
      this.checkDisk(),
    ]);

    const results = {
      status: checks.every(check => check.status === 'fulfilled') ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.0',
      services: {
        database: checks[0].status === 'fulfilled' ? checks[0].value : { status: 'error', error: checks[0].reason },
        redis: checks[1].status === 'fulfilled' ? checks[1].value : { status: 'error', error: checks[1].reason },
        memory: checks[2].status === 'fulfilled' ? checks[2].value : { status: 'error', error: checks[2].reason },
        disk: checks[3].status === 'fulfilled' ? checks[3].value : { status: 'error', error: checks[3].reason },
      },
    };

    return results;
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Readiness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is ready' })
  @ApiResponse({ status: 503, description: 'Service is not ready' })
  async readinessCheck() {
    try {
      await this.checkDatabase();
      await this.checkRedis();
      
      return {
        status: 'ready',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Service not ready');
    }
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Liveness probe for Kubernetes' })
  @ApiResponse({ status: 200, description: 'Service is alive' })
  async livenessCheck() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  private async checkDatabase() {
    try {
      await this.sequelize.query('SELECT 1');
      return {
        status: 'healthy',
        responseTime: Date.now(),
      };
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  private async checkRedis() {
    try {
      const testKey = 'health-check';
      await this.redisService.set(testKey, 'test', 10);
      await this.redisService.get(testKey);
      await this.redisService.del(testKey);
      
      return {
        status: 'healthy',
        responseTime: Date.now(),
      };
    } catch (error) {
      throw new Error(`Redis connection failed: ${error.message}`);
    }
  }

  private async checkMemory() {
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal;
    const usedMemory = memUsage.heapUsed;
    const memoryUsagePercent = (usedMemory / totalMemory) * 100;

    return {
      status: memoryUsagePercent > 90 ? 'warning' : 'healthy',
      usage: {
        rss: Math.round(memUsage.rss / 1024 / 1024 * 100) / 100,
        heapTotal: Math.round(totalMemory / 1024 / 1024 * 100) / 100,
        heapUsed: Math.round(usedMemory / 1024 / 1024 * 100) / 100,
        external: Math.round(memUsage.external / 1024 / 1024 * 100) / 100,
        usagePercent: Math.round(memoryUsagePercent * 100) / 100,
      },
    };
  }

  private async checkDisk() {
    // This is a simplified disk check - in production you'd use a proper disk space monitoring library
    const fs = require('fs');
    const path = require('path');
    
    try {
      const stats = fs.statSync(process.cwd());
      return {
        status: 'healthy',
        available: 'N/A', // Would need proper disk space monitoring
      };
    } catch (error) {
      throw new Error(`Disk check failed: ${error.message}`);
    }
  }
}
