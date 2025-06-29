import { Injectable } from '@nestjs/common';
import { MeiliService } from '@lib/meili';

@Injectable()
export class DiscoveryService {
  constructor(private readonly meiliService: MeiliService) {}

  /**
   * Search for videos using Meilisearch
   */
  async searchVideos(
    query: string,
    options?: {
      limit?: number;
      offset?: number;
      filter?: string | string[];
      sort?: string[];
    },
  ) {
    const { limit = 10, offset = 0, filter, sort } = options || {};

    // Perform search on the 'videos' index
    const result = await this.meiliService.search('videos', query, {
      limit,
      offset,
      filter,
      sort,
    });

    return {
      results: result.hits,
      pagination: {
        offset: result.offset,
        limit: result.limit,
        total: result.totalHits,
      },
    };
  }
}
