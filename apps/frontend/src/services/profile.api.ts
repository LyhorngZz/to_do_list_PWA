import api from "./api";

class ProfileApi {
    async getProfile() {
        const response = await api.get("/profile");
        return response.data;
    }

    async createPin(pin: string) {
        const response = await api.patch("/profile/pin", {
            pin,
        });

        return response.data;
    }

    async changePin(
        oldPin: string,
        newPin: string,
    ) {
        const response = await api.patch(
            "/profile/change-pin",
            {
                oldPin,
                newPin,
            },
        );

        return response.data;
    }
}

export default new ProfileApi();