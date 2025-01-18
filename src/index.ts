import dotenv from "dotenv";
import { startServer } from "./server";

dotenv.config();

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
