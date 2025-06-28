import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import {
  MongooseCollectionNamingPlugin,
  NamingConvention,
} from 'mongoose-collection-naming-plugin';
import { VideoSchema, Video } from '@lib/databases/entities/videos.entity';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<MongooseModuleOptions> => {
        const uri = configService.get<string>('database.url');

        return {
          uri,
          connectionFactory: (connection) => {
            connection.plugin(MongooseCollectionNamingPlugin, {
              namingConvention: NamingConvention.CamelCase,
            });

            return connection;
          },
        };
      },
    }),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
