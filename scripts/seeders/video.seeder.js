import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/video_db'; // change as needed
const COLLECTION_NAME = 'videos'; // your existing collection name

const seedVideos = [
  {
    title: 'Intro to NestJS',
    description: 'Getting started with NestJS',
    category: 'Education',
    language: 'en',
    duration: 600,
    link: "https://res.cloudinary.com/dbifps2yq/video/upload/v1751078446/sf4l0i1pwvvrbiojz0bx.mp4",
    publishDate: new Date('2025-01-01'),
    publishedAt: new Date('2025-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: 'Advanced MongoDB',
    description: 'Learn advanced MongoDB operations',
    category: 'Database',
    language: 'en',
    duration: 900,
    link: "https://res.cloudinary.com/dbifps2yq/video/upload/v1751078446/sf4l0i1pwvvrbiojz0bx.mp4",
    publishDate: new Date('2025-02-01'),
    publishedAt: new Date('2025-02-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // No schema needed — use existing collection directly
    const collection = mongoose.connection.collection(COLLECTION_NAME);

    // Clean up
    await collection.deleteMany({});
    console.log('🧹 Existing videos removed');

    // Insert new data
    const result = await collection.insertMany(seedVideos);
    console.log(`✅ Inserted ${result.insertedCount} videos`);

  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

seed();
