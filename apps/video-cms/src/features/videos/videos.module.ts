import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { DatabaseModule } from '@lib/databases';
import { CloudinaryModule } from '@lib/cloudinary';
import { MeiliModule } from '@lib/meili';

@Module({
  imports: [DatabaseModule, CloudinaryModule, MeiliModule],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
