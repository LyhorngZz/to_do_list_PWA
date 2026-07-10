import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/pages/AuthView.vue'
import TodoView from '@/pages/TodoView.vue'
import { useAuthStore } from '@/stores/auth';
import SettingsView from '@/pages/SettingsView.vue';
import GuestForm from '@/components/GuestForm.vue';

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
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return "/todos";
  }
});

export default router
