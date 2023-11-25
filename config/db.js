// db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const username=process.env.MONGODB_USERNAME;
    const password=process.env.MONGODB_PASSWORD;
    await mongoose.connect('mongodb+srv://'+username+':'+password+'@oims-db-cluster.vftasnd.mongodb.net/OIMS');
    console.log('MongoDB connected');

    // Accessing a specific collection and dropping it
    const connection = mongoose.connection;
    connection.dropCollection('CurrentUser');
    connection.dropCollection('PairedConnections');
    console.log('Collection cleared')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // You might want to handle this error in a different way based on your application's needs
  }
};


export default connectDB;
