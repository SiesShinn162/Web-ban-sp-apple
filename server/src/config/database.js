import mongoose from 'mongoose';
import { ENV } from './env.js';

export async function connectDatabase() {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log(`Kết nối MongoDB thành công: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Lỗi kết nối database MongoDB: ${error.message}`);
    process.exit(1);
  }
}
