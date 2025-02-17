import { createRouter, createWebHistory } from 'vue-router';
import CreateProduct from '../views/CreateProduct.vue'
import ViewProducts from '../views/ViewProducts.vue'

const routes = [
  { path: '/', component: ViewProducts },
  { path: '/create-product', component: CreateProduct },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
