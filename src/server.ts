import { Server } from "@hapi/hapi";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { routes } from "./routes";

dotenv.config();

const getServer = () => {
  const server = new Server({
    host: process.env.HOST!,
    port: parseInt(process.env.PORT!),
  });

  server.route(routes);

  return server;
};

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    await mongoose.connect(mongoURI!);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export const initializeServer = async () => {
  const server = getServer();
  await connectDB();
  await server.initialize();
  return server;
};

export const startServer = async () => {
  const server = await initializeServer();
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
  return server;
};
