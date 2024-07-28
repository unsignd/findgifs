import mongoose from 'mongoose';

export const connect = async () => {
  await mongoose.connect(process.env.DB_URI!);
  console.log('Database is connected');
};
