import { Module } from '@nestjs/common';
import { VideosModule } from './features/videos/videos.module';
import { ConfigModule } from '@lib/config';

@Module({
  imports: [ConfigModule, VideosModule],
})
export class AppModule {}
