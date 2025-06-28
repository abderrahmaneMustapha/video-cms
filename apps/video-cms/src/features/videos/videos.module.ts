import { Module } from '@nestjs/common';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { DatabaseModule } from '@lib/databases';
import { CloudinaryModule } from '@lib/cloudinary';

@Module({
  imports: [DatabaseModule, CloudinaryModule],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
