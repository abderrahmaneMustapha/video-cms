import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { DatabaseModule } from '@lib/databases';
import { CloudinaryModule } from '@lib/cloudinary';
import { MeiliModule } from '@lib/meili';
import { RedisModule } from '@lib/redis';

@Module({
  imports: [DatabaseModule, CloudinaryModule, MeiliModule, RedisModule],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
