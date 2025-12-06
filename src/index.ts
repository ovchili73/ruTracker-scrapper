import { env } from "./config/env";
import { connectDatabase } from "./config/db";
import { HttpClient } from "./utils/http";
import { AuthService } from "./services/AuthService";

async function main() {
  console.log("🚀 Запуск RuTracker Parser\n");
  console.log(`Окружение: ${env.NODE_ENV}`);
  console.log(`Лимит топиков: ${env.TORRENTS_LIMIT}\n`);

  await connectDatabase();

  const http = new HttpClient();
  const authService = new AuthService(http);

  const isAuth = await authService.login();
  if (!isAuth) {
    console.error("❌ Не удалось авторизоваться");
    process.exit(1);
  }

  // Проверяем сессию
  await authService.checkAuth();

  console.log("\n✅ Авторизация завершена!");
  process.exit(0);
}

main().catch((error) => {
  console.error("💥 Критическая ошибка:", error);
  process.exit(1);
});
