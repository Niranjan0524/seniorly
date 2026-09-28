import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalCache = globalThis as typeof globalThis & {
  mongooseCache?: MongooseCache;
};

const cached: MongooseCache = globalCache.mongooseCache ?? {
  conn: null,
  promise: null,
};

globalCache.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((connection) => {
        cached.conn = connection;
        return connection;
      })
      .catch((error: unknown) => {
        cached.promise = null;
        throw error;
      });
  }

  return cached.promise;
}
