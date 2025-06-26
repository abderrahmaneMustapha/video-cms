import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VideoDocument = Video & Document;

@Schema({ timestamps: true })
export class Video {
  @Prop({ required: true, trim: true, index: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ required: true, trim: true, index: true })
  language: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  publishDate: Date;

  @Prop({ required: true })
  publishedAt: Date;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
VideoSchema.index({ title: 'text', description: 'text', category: 'text' });
