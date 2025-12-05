import mongoose from "mongoose";
import env from "./env";

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      dbName: env.MONGO_DB_NAME,
    });

    console.log("✅ MongoDB подключена");
  } catch (e) {
    console.error("❌ Ошибка подключения к MongoDB:", e);
    process.exit(1);
  }
};
