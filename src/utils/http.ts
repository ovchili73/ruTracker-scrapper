import axios, { AxiosInstance } from "axios";
import { env } from "../config/env";

export class HttpClient {
  private client: AxiosInstance;
  private cookies: Map<string, string> = new Map();

  constructor() {
    // Загружаем cookies из .env при инициализации
    this.loadCookiesFromEnv();

    this.client = axios.create({
      baseURL: "https://rutracker.org",
      timeout: 30000,
      withCredentials: true,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
      },
    });

    // Request interceptor - добавляем cookies
    this.client.interceptors.request.use((config) => {
      if (this.cookies.size > 0) {
        const cookieString = Array.from(this.cookies.entries())
          .map(([key, value]) => `${key}=${value}`)
          .join("; ");

        config.headers.Cookie = cookieString;
      }

      return config;
    });

    // Response interceptor - сохраняем cookies
    this.client.interceptors.response.use((response) => {
      const setCookieHeaders = response.headers["set-cookie"];

      if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
        setCookieHeaders.forEach((cookie) => {
          const [nameValue] = cookie.split(";");
          const [name, value] = nameValue.split("=");

          if (name && value) {
            this.cookies.set(name.trim(), value.trim());
          }
        });
      }

      return response;
    });

    if (this.cookies.size > 0) {
      console.log(`🍪 Загружено ${this.cookies.size} cookies из .env`);
    }
  }

  private loadCookiesFromEnv(): void {
    // Загружаем все cookies из environment
    if (env.BB_SESSION) {
      this.cookies.set("bb_session", env.BB_SESSION);
    }
    if (env.BB_GUID) {
      this.cookies.set("bb_guid", env.BB_GUID);
    }
    if (env.BB_SSL) {
      this.cookies.set("bb_ssl", env.BB_SSL);
    }
    if (env.CF_CLEARANCE) {
      this.cookies.set("cf_clearance", env.CF_CLEARANCE);
    }
  }

  async delay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, env.REQUEST_DELAY));
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  getCookies(): Map<string, string> {
    return this.cookies;
  }

  setCookie(name: string, value: string): void {
    this.cookies.set(name, value);
  }

  hasCookie(name: string): boolean {
    return this.cookies.has(name);
  }

  getCookie(name: string): string | undefined {
    return this.cookies.get(name);
  }

  clearCookies(): void {
    this.cookies.clear();
  }
}
