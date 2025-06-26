import { Controller, Get } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller()
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get()
  getHello(): string {
    return this.discoveryService.getHello();
  }
}
