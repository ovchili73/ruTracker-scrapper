import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  MONGO_URI: z.string().url().default("mongodb://localhost:27017/rutracker"),
  MONGO_DB_NAME: z.string().default("rutracker"),
  RUTRACKER_USERNAME: z.string().min(1, "Username обязателен"),
  RUTRACKER_PASSWORD: z.string().min(1, "Password обязателен"),
  TORRENTS_LIMIT: z.coerce.number().int().positive().default(10),
  REQUEST_DELAY: z.coerce.number().int().min(100).default(1000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(3000),

  // Ручные cookies
  BB_SESSION: z.string().optional(),
  BB_GUID: z.string().optional(),
  BB_SSL: z.string().optional(),
  CF_CLEARANCE: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const loadConfig = async (): Promise<Env> => {
  try {
    const parsed = await envSchema.parseAsync(process.env);

    console.log("✅ Конфигурация загружена");

    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Ошибка валидации .env:");
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
    } else {
      console.error("❌ Неожиданная ошибка при загрузке конфигурации:", error);
    }
    process.exit(1);
  }
};

export const env = await loadConfig();
export default env;
