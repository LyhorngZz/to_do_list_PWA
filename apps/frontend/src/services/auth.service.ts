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
}

export default new AuthService();