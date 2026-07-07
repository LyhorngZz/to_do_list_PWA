import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const accessToken = ref(localStorage.getItem("accessToken") || "");

    const isAuthenticated = computed(() => !!accessToken.value);

    function login(token: string) {
        accessToken.value = token;
        localStorage.setItem("accessToken", token);
    }

    function logout() {
        accessToken.value = "";
        localStorage.removeItem("accessToken");
    }

    return {
        accessToken,
        isAuthenticated,
        login,
        logout,
    };
});