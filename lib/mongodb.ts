import mongoose from "mongoose";

const MONGODB_URI = 'mongodb+srv://souravsuman846_db_user:kb3jZSJMz7bxIGhL@cluster0.0bevmo7.mongodb.net/'
import { User } from "../models/User";
import bcrypt from "bcryptjs";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    
    // Auto-seed admin user
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await User.create({
        xts_id: 'ADMIN',
        email: 'admin@xts.com',
        name: 'XTS Administrator',
        role: 'admin',
        password: hashedPassword
      });
      console.log('Admin seeded: admin@xts.com / admin');
    }
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;

