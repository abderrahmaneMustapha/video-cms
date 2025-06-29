import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { MeiliModule } from '@lib/meili';
import { ConfigModule } from '@lib/config';

@Module({
  imports: [ConfigModule, MeiliModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
})
export class DiscoveryModule {}
