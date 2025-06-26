import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import {
  MongooseCollectionNamingPlugin,
  NamingConvention,
} from 'mongoose-collection-naming-plugin';

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

            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return connection;
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}
