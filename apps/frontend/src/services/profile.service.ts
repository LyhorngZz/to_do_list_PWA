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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
    }

    async updateProfile(data: {
        username?: string;
        email?: string;
        isGuest?: boolean;
    }) {

        console.log("Updating profile with:", data);

        const profile = await this.getProfile();

        console.log("Current profile:", profile?.toJSON());

        if (!profile) {
            console.log("No profile found!");
            return;
        }

        await profile.incrementalPatch({
            ...data,
            updatedAt: new Date().toISOString(),
        });

        const updated = await this.getProfile();

        console.log(updated?.toJSON());
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