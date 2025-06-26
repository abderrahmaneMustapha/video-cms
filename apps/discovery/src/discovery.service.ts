import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscoveryService {
  getHello(): string {
    return 'Hello World!';
  }
}
