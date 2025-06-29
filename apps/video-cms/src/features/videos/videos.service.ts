import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from '@lib/databases';
import { CreateVideoDto, UpdateVideoDto } from './dtos/videos.dto';
import { CloudinaryService } from '@lib/cloudinary';
import { MeiliService } from '@lib/meili';
import { RedisService } from '@lib/redis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VideosService {
  private readonly CACHE_TTL;

  constructor(
    @InjectModel(Video.name)
    private readonly videoModel: Model<VideoDocument>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly meiliService: MeiliService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.CACHE_TTL = this.configService.get<string>('redis.ttl');
  }

  async create(dto: CreateVideoDto, file: Express.Multer.File) {
    const uploadResult = await this.cloudinaryService.uploadVideo(file);
    const createdVideo = await this.videoModel.create({
      ...dto,
      link: uploadResult.secure_url,
    });

    const doc = {
      id: createdVideo.id,
      ...createdVideo.toObject(),
    };

    await this.meiliService.addDocuments('videos', [doc]);
    await this.setCache(createdVideo.id, doc); // Optional: pre-cache new video

    return createdVideo;
  }

  async findAll() {
    return this.videoModel.find().exec();
  }

  async findOne(id: string) {
    const cacheKey = this.getCacheKey(id);
    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const video = await this.videoModel.findById(id).exec();
    if (!video) throw new NotFoundException('Video not found');

    await this.setCache(cacheKey, video.toObject());
    return video.toObject();
  }

  async update(id: string, dto: UpdateVideoDto) {
    const video = await this.videoModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    if (!video) throw new NotFoundException('Video not found');

    const doc = {
      id: video.id,
      ...video.toObject(),
    };

    await this.meiliService.addDocuments('videos', [doc]);
    await this.invalidateCache(id);

    return video;
  }

  async remove(id: string) {
    const video = await this.videoModel.findByIdAndDelete(id);
    if (!video) throw new NotFoundException('Video not found');

    await this.meiliService.deleteDocuments('videos', [id]);
    await this.invalidateCache(id);

    return video;
  }

  private getCacheKey(id: string): string {
    return `video:${id}`;
  }

  private async setCache(key: string, value: any): Promise<void> {
    await this.redisService.set(key, JSON.stringify(value), this.CACHE_TTL);
  }

  private async invalidateCache(id: string): Promise<void> {
    const key = this.getCacheKey(id);
    await this.redisService.delete(key);
  }
}
