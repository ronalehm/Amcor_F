import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status', () => {
    const result = controller.check();
    expect(result).toHaveProperty('status');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('environment');
    expect(result.status).toBe('ok');
  });

  it('should return valid ISO timestamp', () => {
    const result = controller.check();
    const timestamp = new Date(result.timestamp);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
