import { NestFactory } from '@nestjs/core';
import { DiscoveryModule } from './discovery.module';

async function bootstrap() {
  const app = await NestFactory.create(DiscoveryModule);
  await app.listen(process.env.DISCOVERY_PORT ?? 3001);
}
bootstrap();
