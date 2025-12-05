import { connectDatabase } from "./config/db";
import { env } from "./config/env";

async function main() {
  console.log("🚀 Запуск RuTracker Parser\n");
  console.log(`Окружение: ${env.NODE_ENV}`);
  console.log(`Лимит топиков: ${env.TORRENTS_LIMIT}\n`);

  await connectDatabase();

  console.log("✅ Инициализация завершена!");
  process.exit(0);
}

main().catch((error) => {
  console.error("💥 Критическая ошибка:", error);
  process.exit(1);
});
