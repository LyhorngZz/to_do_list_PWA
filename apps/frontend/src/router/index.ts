import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '@/pages/AuthView.vue'
import TodoView from '@/pages/TodoView.vue'
import { useAuthStore } from '@/stores/auth';

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
        guest: true,
      }
    },
    {
      path: "/todos",
      name: 'todos',
      component: TodoView,
      meta: {
        requiresAuth: true,
      }
    },
  ],
});

router.beforeEach((to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return "/login";
  }

  if (to.meta.guest && authStore.isAuthenticated) {
    return "/todos";
  }
});

export default router
