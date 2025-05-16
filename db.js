import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectDB() {
    try {
        await client.connect();
        console.log('✅ Connected successfully to MongoDB!');
        db = client.db('aurory');
    } catch (error) {
        console.error('❌ Connection error:', error);
        process.exit(1);
    }
}

await connectDB();

export { db };