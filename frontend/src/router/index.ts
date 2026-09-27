import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Items from '../views/Items.vue';
import AddItem from '../views/AddItem.vue';

const routes = [
  { path: '/', component: Dashboard },
  { path: '/items', component: Items },
  { path: '/items/add', component: AddItem },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
