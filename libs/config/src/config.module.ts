import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration, { validate } from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      load: [configuration],
      validate,
      isGlobal: true,
    }),
  ],
  exports: [NestConfigModule],
})
export class ConfigModule {}
