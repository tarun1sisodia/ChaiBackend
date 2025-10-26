// Usage: set MONGO_URI in your environment or create a local .env with MONGO_URI
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env FIRST
dotenv.config({ path: ".env" });

async function test() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGO_URI not set in environment. Check .env file or env vars.');
    process.exit(1);
  }
  try {
    console.log('Connecting to:', uri.replace(/(:\/\/.*:)(.*)@/, '$1****@')); // hide password
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB successfully.');
    // Quick write test:
    const TestSchema = new mongoose.Schema({ name: String }, { collection: 'test_connection' });
    const Test = mongoose.model('TestConnection', TestSchema);
    const doc = await Test.create({ name: 'connection-test-' + new Date().toISOString() });
    console.log('Inserted test doc id:', doc._id.toString());
    // Clean up:
    await Test.deleteOne({ _id: doc._id });
    console.log('Cleanup complete. Exiting.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection or write test failed:', err);
    process.exit(1);
  }
}

test();