import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import profileService from "@/services/profile.service";

export async function checkPinGuard() {

    const authStore = useAuthStore();
    const router = useRouter();

    if (!authStore.isAuthenticated) {
        return;
    }

    const profile = await profileService.getProfile();

    if (!profile?.hasPin) {
        return;
    }

    if (!authStore.pinUnlocked) {
        router.replace("/pin");
    }

}