import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {

    const accessToken = ref(
        localStorage.getItem("accessToken") || ""
    );

    const pinUnlocked = ref(
        false
    );

    const isAuthenticated = computed(() => !!accessToken.value);

    function login(token: string) {
        accessToken.value = token;
        localStorage.setItem("accessToken", token);

        lockPin();
    }

    function logout() {
        accessToken.value = "";
        pinUnlocked.value = false;

        lockPin();

        localStorage.removeItem("accessToken");
    }

    function unlockPin() {
        pinUnlocked.value = true;
    }

    function lockPin() {
        pinUnlocked.value = false;
    }

    return {
        accessToken,
        pinUnlocked,
        isAuthenticated,
        login,
        logout,
        unlockPin,
        lockPin,
    };
});