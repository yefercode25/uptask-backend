import mongoose from 'mongoose';

export const conectDB = async () => { 
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL!);
    const url = `${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`;
    console.log(`MongoDB conectado a: ${url}`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
}