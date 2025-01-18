import dotenv from "dotenv";
import mongoose from "mongoose";
import { startServer } from "./server";

dotenv.config();

const connectDB = async () => {
  console.log(process.env.MONGODB_URI);
  try {
    // Usamos una variable de entorno para la URL de MongoDB, con fallback a localhost
    const mongoURI = process.env.MONGODB_URI;

    await mongoose.connect(mongoURI!);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

// Función principal asíncrona
const init = async () => {
  try {
    await startServer();
  } catch (err) {
    console.error("Error starting application:", err);
    process.exit(1);
  }
};

// Ejecutamos la función principal
init();
