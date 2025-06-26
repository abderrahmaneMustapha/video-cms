import { NestFactory } from '@nestjs/core';
import { DiscoveryModule } from './discovery.module';

async function bootstrap() {
  const app = await NestFactory.create(DiscoveryModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
