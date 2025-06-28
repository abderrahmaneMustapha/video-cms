import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from '@lib/databases';
import { CreateVideoDto, UpdateVideoDto } from './dtos/videos.dto';
import { CloudinaryService } from '@lib/cloudinary';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video.name)
    private readonly videoModel: Model<VideoDocument>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(dto: CreateVideoDto, file: Express.Multer.File) {
    // Upload to Cloudinary using the file buffer or path
    const uploadResult = await this.cloudinaryService.uploadVideo(file);

    // Save in DB
    const createdVideo = await this.videoModel.create({
      ...dto,
      link: uploadResult.secure_url,
    });

    return createdVideo;
  }

  findAll() {
    return this.videoModel.find().exec();
  }

  async findOne(id: string) {
    const video = await this.videoModel.findById(id).exec();
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async update(id: string, dto: UpdateVideoDto) {
    const video = await this.videoModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }

  async remove(id: string) {
    const video = await this.videoModel.findByIdAndDelete(id);
    if (!video) throw new NotFoundException('Video not found');
    return video;
  }
}
