// meili.service.ts

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MeiliSearch, EnqueuedTask } from 'meilisearch';

@Injectable()
export class MeiliService {
  private client: MeiliSearch;

  constructor(private readonly configService: ConfigService) {
    this.client = new MeiliSearch({
      host: this.configService.get<string>('meili.host') as string,
    });
  }

  /**
   * Get or create an index with primary key 'id'
   */
  async getIndex(indexName: string) {
    try {
      const index = this.client.index(indexName);
      await index.fetchInfo(); // Throws if index doesn't exist
      return index;
    } catch {
      // Create index with primary key 'id'
      const createdIndex = await this.client.createIndex(indexName, {
        primaryKey: 'id',
      });
      this.waitForUpdate(createdIndex.taskUid);
      return this.client.index(indexName);
    }
  }

  /**
   * Add or update documents in the given index
   */
  async addDocuments(indexName: string, documents: any[]) {
    const index = await this.getIndex(indexName);
    return await index.addDocuments(documents);
  }

  /**
   * Wait for a task to complete (e.g., document addition)
   */
  async waitForUpdate(taskId: number): Promise<void> {
    await this.client.tasks.waitForTask(taskId);
  }

  /**
   * Delete documents by IDs
   */
  async deleteDocuments(
    indexName: string,
    ids: string[],
  ): Promise<EnqueuedTask> {
    const index = await this.getIndex(indexName);
    return await index.deleteDocuments(ids);
  }

  /**
   * Search documents by query
   */
  async search(
    indexName: string,
    query: string,
    searchParams?: Record<string, any>,
  ): Promise<{
    hits: any[];
    offset: number;
    limit: number;
    totalHits: number;
  }> {
    const index = await this.getIndex(indexName);
    const result = await index.search(query, searchParams);
    return {
      hits: result.hits,
      offset: result.offset,
      limit: result.limit,
      totalHits: result.estimatedTotalHits,
    };
  }
}
