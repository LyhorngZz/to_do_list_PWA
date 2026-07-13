import db from "@/database";

class ProfileService {

    async getProfile() {
        return await db.profile
            .findOne("profile")
            .exec();
    }

    async createGuestProfile(username: string) {

        const existing = await this.getProfile();

        if (existing) {
            return existing;
        }

        return await db.profile.insert({
            id: "profile",
            username,
            email: "",
            isGuest: true,
            hasPin: false,
            pinHash: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }

    async updateProfile(data: {
        username?: string;
        email?: string;
        isGuest?: boolean;
        hasPin?: boolean;
        pinHash?: string;
    }) {

        let profile = await this.getProfile();

        if (!profile) {
            profile = await db.profile.insert({
                id: "profile",
                username: data.username ?? "",
                email: data.email ?? "",
                isGuest: data.isGuest ?? true,
                hasPin: data.hasPin ?? false,
                pinHash: data.pinHash ?? "",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            return profile;
        }

        await profile.incrementalPatch({
            ...data,
            updatedAt: new Date().toISOString(),
        });

        return profile;
    }

    async clearProfile() {

        const profile = await this.getProfile();

        if (!profile) {
            return;
        }

        await profile.remove();
    }

}

export default new ProfileService();