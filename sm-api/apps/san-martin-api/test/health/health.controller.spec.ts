import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../../src/api/health/health.controller';
import { AppConfigService, RedisService } from '@san-martin/san-martin-libs';
import { Sequelize } from 'sequelize-typescript';

describe('HealthController', () => {
  let controller: HealthController;
  let redisService: RedisService;
  let sequelize: Sequelize;

  const mockAppConfigService = {
    jwtSecret: 'test-secret',
  };

  const mockRedisService = {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };

  const mockSequelize = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: AppConfigService,
          useValue: mockAppConfigService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: 'SEQUELIZE',
          useValue: mockSequelize,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    redisService = module.get<RedisService>(RedisService);
    sequelize = module.get<Sequelize>('SEQUELIZE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return basic health status', () => {
      const result = controller.healthCheck();
      
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('version');
    });
  });

  describe('detailedHealthCheck', () => {
    it('should return detailed health status when all services are healthy', async () => {
      mockSequelize.query.mockResolvedValue('OK');
      mockRedisService.set.mockResolvedValue('OK');
      mockRedisService.get.mockResolvedValue('test');
      mockRedisService.del.mockResolvedValue('OK');

      const result = await controller.detailedHealthCheck();

      expect(result).toHaveProperty('status', 'healthy');
      expect(result).toHaveProperty('services');
      expect(result.services).toHaveProperty('database');
      expect(result.services).toHaveProperty('redis');
      expect(result.services).toHaveProperty('memory');
      expect(result.services).toHaveProperty('disk');
    });

    it('should return unhealthy status when database fails', async () => {
      mockSequelize.query.mockRejectedValue(new Error('Database connection failed'));

      const result = await controller.detailedHealthCheck();

      expect(result).toHaveProperty('status', 'unhealthy');
      expect(result.services.database).toHaveProperty('status', 'error');
    });
  });

  describe('readinessCheck', () => {
    it('should return ready when all services are healthy', async () => {
      mockSequelize.query.mockResolvedValue('OK');
      mockRedisService.set.mockResolvedValue('OK');
      mockRedisService.get.mockResolvedValue('test');
      mockRedisService.del.mockResolvedValue('OK');

      const result = await controller.readinessCheck();

      expect(result).toHaveProperty('status', 'ready');
    });

    it('should throw error when services are not ready', async () => {
      mockSequelize.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(controller.readinessCheck()).rejects.toThrow('Service not ready');
    });
  });

  describe('livenessCheck', () => {
    it('should return alive status', () => {
      const result = controller.livenessCheck();

      expect(result).toHaveProperty('status', 'alive');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
    });
  });
});
