import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/home.vue') },
  { path: '/import', component: () => import('../views/import.vue') },
  { path: '/inventory', component: () => import('../views/inventory.vue') },
  { path: '/editor', component: () => import('../views/editor.vue') },
  { path: '/guide', component: () => import('../views/guide.vue') },
  { path: '/about', component: () => import('../views/about.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
