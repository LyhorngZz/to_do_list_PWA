import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const isAuthenticated = ref(
        localStorage.getItem("isAuthenticated") === "true"
    );

    function login() {
        isAuthenticated.value = true;
        localStorage.setItem("isAuthenticated", "true");
    }

    function logout() {
        isAuthenticated.value = false;
        localStorage.removeItem("isAuthenticated");
    }

    return {
        isAuthenticated,
        login,
        logout,
    };
});