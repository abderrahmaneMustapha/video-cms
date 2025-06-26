import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

describe('DiscoveryController', () => {
  let discoveryController: DiscoveryController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveryController],
      providers: [DiscoveryService],
    }).compile();

    discoveryController = app.get<DiscoveryController>(DiscoveryController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(discoveryController.getHello()).toBe('Hello World!');
    });
  });
});
