import api from "./api";

class AuthService {
    async login(email: string, password: string) {
        const response = await api.post("/auth/login", {
            email,
            password,
        });

        return response.data;
    }

    async register(username: string, email: string, password: string) {
        const response = await api.post("/auth/register", {
            username,
            email,
            password,
        });

        return response.data;
    }

    async profile() {
        const response = await api.get("/auth/profile");
        return response.data;
    }

    async loginWithTelegram(): Promise<string | null> {
        const tg = (window.Telegram as any)?.WebApp as { initData?: string } | undefined;
        if (!tg?.initData) return null;

        const { data } = await api.post("/auth/telegram", {
            initData: tg.initData,
        });

        localStorage.setItem("accessToken", data.access_token);
        return data.access_token;
    }
}

export default new AuthService();