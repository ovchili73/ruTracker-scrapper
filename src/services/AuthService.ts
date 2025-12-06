import { HttpClient } from "../utils/http";
import { env } from "../config/env";

export class AuthService {
  constructor(private http: HttpClient) {}

  async login(): Promise<boolean> {
    // Проверяем, есть ли cookies из .env
    if (
      this.http.hasCookie("bb_session") &&
      this.http.hasCookie("cf_clearance")
    ) {
      console.log("🍪 Используются cookies из .env");

      // Проверяем, что они рабочие
      const isValid = await this.checkAuth();
      if (isValid) {
        console.log("✅ Cookies валидны, авторизация успешна!");
        return true;
      } else {
        console.warn("⚠️  Cookies из .env устарели, пробуем авторизацию...");
      }
    }

    // Если cookies нет или не валидны - пробуем стандартную авторизацию
    return await this.tryStandardLogin();
  }

  private async tryStandardLogin(): Promise<boolean> {
    try {
      console.log("🔐 Попытка стандартной авторизации...");

      const formData = new URLSearchParams();
      formData.append("login_username", env.RUTRACKER_USERNAME);
      formData.append("login_password", env.RUTRACKER_PASSWORD);
      formData.append("login", "Вход");

      const response = await this.http
        .getClient()
        .post("/forum/login.php", formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Referer: "https://rutracker.org/forum/index.php",
          },
          maxRedirects: 5,
        });

      // Проверяем результат
      if (response.data.includes("captcha")) {
        console.error("❌ Требуется капча! Используй ручные cookies.");
        console.log("\n📋 Инструкция:");
        console.log("1. Открой https://rutracker.org в браузере");
        console.log("2. Авторизуйся (пройди капчу если нужно)");
        console.log("3. F12 → Application → Cookies → rutracker.org");
        console.log("4. Скопируй cookies в .env (см. .env.example)");
        return false;
      }

      const hasSession = this.http.hasCookie("bb_session");

      if (hasSession) {
        console.log("✅ Авторизация успешна!");

        // Выводим полученные cookies для сохранения
        console.log("\n💡 Сохрани эти cookies в .env для следующего раза:");
        this.http.getCookies().forEach((value, key) => {
          console.log(`${key.toUpperCase()}=${value}`);
        });

        return true;
      }

      console.error("❌ Авторизация не удалась");
      return false;
    } catch (error: any) {
      console.error("❌ Ошибка авторизации:", error.message);

      if (error.response?.status === 403) {
        console.log(
          "⚠️  Cloudflare блокирует запросы. Используй ручные cookies из браузера."
        );
      }

      return false;
    }
  }

  async checkAuth(): Promise<boolean> {
    try {
      await this.http.delay();
      const response = await this.http.getClient().get("/forum/index.php");

      const isAuth =
        response.data.includes("profile.php") ||
        response.data.includes("Выход") ||
        response.data.includes("logged-in") ||
        !response.data.includes("Вход");

      if (isAuth) {
        console.log("✅ Авторизация подтверждена");
      } else {
        console.log("❌ Не авторизован");
      }

      return isAuth;
    } catch (error: any) {
      console.error("❌ Ошибка проверки авторизации:", error.message);
      return false;
    }
  }
}
