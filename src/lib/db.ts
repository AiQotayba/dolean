import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dolean';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const LOCAL_FALLBACK_URI = 'mongodb://127.0.0.1:27017/dolean';

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 2500,
    };

    cached.promise = (async () => {
      try {
        const instance = await mongoose.connect(MONGODB_URI, opts);
        console.log('✅ تم الاتصال بقاعدة بيانات MongoDB بنجاح.');
        return instance;
      } catch (err: any) {
        if (MONGODB_URI !== LOCAL_FALLBACK_URI) {
          console.warn('⚠️ فشل الاتصال بقاعدة البيانات السحابية (Atlas)، جاري الاتصال تلقائياً بالقاعدة المحلية...');
          try {
            const fallbackInstance = await mongoose.connect(LOCAL_FALLBACK_URI, opts);
            console.log('✅ تم الاتصال بقاعدة بيانات MongoDB المحلية بنجاح.');
            return fallbackInstance;
          } catch (localErr: any) {
            console.error('❌ فشل الاتصال بالقاعدة المحلية أيضاً:', localErr.message);
            throw err;
          }
        }
        throw err;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
