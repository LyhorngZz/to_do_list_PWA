import { getDeviceId } from "@/utils/device";
import api from "./api";

class AuthService {
    async login(email: string, password: string) {
        const deviceId = getDeviceId();

        //console.log("Device ID:", deviceId);
        console.log("Sending login:", {
            email,
            password,
            deviceId,
        });

        const response = await api.post("/auth/login", {
            email,
            password,
            deviceId,
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
        console.log(
            "Token in localStorage:",
            localStorage.getItem("accessToken"),
        );

        const response = await api.get("/auth/profile");

        return response.data;
    }

    async verifyPin(pin: string) {
        const response = await api.post(
            "/auth/verify-pin",
            {
                pin,
            },
        );

        return response.data;
    }
}

export default new AuthService();