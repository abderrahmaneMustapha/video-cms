# Video CMS & Discovery System README

## Overview  
This system lets admins upload and manage videos and allows users to search and discover them. It’s built with **NestJS**, **MongoDB**, **Meilisearch**, **Cloudinary**, and **Redis**.  

---

### Core Features  
1. **CMS (Content Management System)**  
   - Upload videos via Cloudinary.  
   - Store metadata (title, description, category, etc.) in MongoDB.  
   - Sync data to Meilisearch for fast search.  

2. **Discovery**  
   - Search videos using Meilisearch (supports filters like genre, year).  

3. **Caching**  
   - Redis caches video details to reduce database load.  

---

## What I Built  
### 1. **Architecture**  
- **Modular Monorepo**: Shared libraries for config, databases, Cloudinary, Meilisearch, and Redis.  
- **CMS App**: Handles CRUD operations and syncs data to Meilisearch.  
- **Discovery App**: Powers search using Meilisearch.  
- **Docker**: Local development with MongoDB, Redis, and Meilisearch.  

### 2. **Key Integrations**  
- **Cloudinary**: Stores and delivers video files with high performance and
  with the usage of cdn features .  
- **Meilisearch**: Fast, scalable search with filtering/sorting.  
- **Redis**: 
  - Cache-Aside Method is used where application checks the cache first. If the data is present (cache hit), it's returned. If not (cache miss), the data is fetched from the database, stored in the cache, and then returned
  - Caches video details (`GET /videos/:id`) and  invalidate cache
  incase of an update or delete  

---

## What I Would Do to Scale This in Production  

### 1. **Database Scaling with Sharding**  
- **Why**: MongoDB handles large datasets by splitting data into shards (e.g., by `userId` or `category`).  
- **How**:  
  - Choose a shard key (e.g., `userId` for user-specific videos).  
  - Split data across multiple MongoDB nodes.  
  - Use replica sets for fault tolerance and read optimization

### 2. **User Authentication & Roles**  
- **Admin Users**: Can upload/edit/delete videos.  
- **Regular Users**: Can only search and view videos.  
- **How**:  
  - Use JWT tokens to authenticate users.  
  - Add role-based guards in NestJS:  
    ```ts
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete('/videos/:id')
    deleteVideo(@Param('id') id: string) {
      return this.videosService.remove(id);
    }
    ```

### 3. **Swagger Documentation**  
- Generate interactive API docs with Swagger:  
  ```bash
  npm install @nestjs/swagger swagger-ui-express
  ```
  ```ts
  // main.ts
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  ```
- Access docs at `/api` (e.g., `GET /search/videos`, `POST /videos`).  

### 4. **Async Meilisearch Updates with BullMQ**  
- **Problem**: Syncing Meilisearch during video uploads/deletes can slow down the CMS.  
- **Solution**: Use a queue to handle updates asynchronously.  
  - **Producer**: Add tasks to a queue when videos are created/updated.  
  - **Consumer**: Process tasks in the background and retry failed updates.  
  ```ts
  // Example: Update Meilisearch via BullMQ
  @Processor('meiliQueue')
  export class MeiliProcessor {
    @Process()
    async updateSearch(job: Job) {
      const { video } = job.data;
      await this.meiliService.addDocuments('videos', [video]);
    }
  }
  ```
- **Retry Logic**: Automatically retry failed tasks 3x before logging errors.  

### 5. **Load Balancer**  
- **Why**: Distribute traffic across multiple instances of CMS/Discovery apps.  
- **How**:  
  - Use **NGINX** or **Kubernetes Ingress** to route requests.  
  - Improve uptime and handle traffic spikes.  

### 6. **Redis as a Dedicated Cache**  
- **Why**: Decouple caching from app logic for easier scaling.  
- **How**:  
  - Run Redis separately (e.g., Redis Cluster or AWS ElastiCache).  
  - Cache frequently accessed data (e.g., popular video details).  

---

## Future Improvements  
1. **Rate Limiting**: Protect public search endpoints from abuse.  
2. **Monitoring**: Add Prometheus/Grafana for metrics (e.g., request latency, error rates).  
3. **CI/CD**: Automate testing and deployment with GitHub Actions.  
4. **Media Processing**: Use AWS Lambda to transcode videos asynchronously.  

---

## How to Run  
1. Copy `.env.example` to `.env` and fill in keys (Cloudinary, Meilisearch).  
2. Start Monogodb, Redis, Melisearch:  
   ```bash
    docker compose up
   ```
3. Seed sample data:  
   ```bash
   pnpm run seed
   ```
3. Run cms and discovery service:  
   ```bash
   pnpm run start
   pnpm run start:discovery
   ```
---

## Endpoints  
### CMS (video-cms)  
- `POST /videos` - Upload a video  
  Example:
   ```form-data
  // please use form data
  description:Getting started with NestJS A
  category:Education
  language:en
  duration:600
  publishDate:2025-01-01T00:00:00.000Z
  publishedAt:2025-01-01T00:00:00.000Z
  title:Nestjs
  file: file_path_here
   ```
- `PUT /videos` - Upload a video similar to POST but can not update videos
- `GET /videos/:id` - Get video details  
- `DELETE /videos/:id` - Delete video  

### Discovery (discovery)  
- `GET /search/videos?q=space` - Search videos  
