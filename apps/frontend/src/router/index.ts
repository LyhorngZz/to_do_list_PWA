import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/pages/AuthView.vue'
import TodoView from '@/pages/TodoView.vue'
import { useAuthStore } from '@/stores/auth';
import SettingsView from '@/pages/SettingsView.vue';
import GuestForm from '@/components/GuestForm.vue';
import PinView from '@/pages/PinView.vue';
import profileService from '@/services/profile.service';
import MapPage from '@/pages/MapPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: 'login',
      component: AuthView,
      meta: {
        guestOnly: true,
      }
    },
    {
      path: "/guest",
      component: GuestForm,
    },
    {
      path: "/todos",
      name: 'todos',
      component: TodoView,
    },
    {
      path: "/settings",
      name: "Settings",
      component: SettingsView,
    },
    {
      path: "/pin",
      name: "pin",
      component: PinView,
    },
    {
      path: "/map",
      name: 'map',
      component: MapPage,
    }
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  const profile = await profileService.getProfile();

  // ==========================
  // Login page
  // ==========================

  if (to.path === "/login") {

    // Logged in and unlocked
    if (authStore.isAuthenticated && authStore.pinUnlocked) {
      return "/todos";
    }

    // Logged in but locked
    if (authStore.isAuthenticated && profile?.hasPin) {
      return "/pin";
    }

    return true;
  }

  // ==========================
  // PIN page
  // ==========================

  if (to.path === "/pin") {

    if (!authStore.isAuthenticated) {
      return "/login";
    }

    if (!profile?.hasPin) {
      return "/todos";
    }

    if (authStore.pinUnlocked) {
      return "/todos";
    }

    return true;
  }

  // ==========================
  // Protected pages
  // ==========================

  if (
    to.path === "/todos" ||
    to.path === "/settings"
  ) {

    // Guest is allowed
    if (!authStore.isAuthenticated) {
      return true;
    }

    // Logged in with PIN but locked
    if (
      profile?.hasPin &&
      !authStore.pinUnlocked
    ) {
      return "/pin";
    }
  }

  return true;
});

export default router
