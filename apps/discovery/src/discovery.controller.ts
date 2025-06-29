import { Controller, Get, Query } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';

@Controller('search')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('videos')
  async searchVideos(
    @Query('q') query: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Query('filter') filter?: string | string[],
    @Query('sort') sort?: string[],
  ) {
    return this.discoveryService.searchVideos(query, {
      limit,
      offset,
      filter,
      sort,
    });
  }
}
