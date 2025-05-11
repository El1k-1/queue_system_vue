import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ServicesView from '@/views/ServicesView.vue'
import RequestsView from '@/views/RequestsView.vue'
import EmployeeView from '@/views/EmployeeView.vue'

Vue.use(VueRouter)

const { BASE_URL } = process.env

const routes = [
  {
    path: '/',
    name: 'main',
    component: HomeView
  },
  {
    path: '/services',
    name: 'services',
    component: ServicesView
  },
  {
    path: '/requests',
    name: 'requests',
    component: RequestsView
  },
  {
    path: '/emplyee',
    name: 'emplyee',
    component: EmployeeView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: BASE_URL,
  routes
})

export default router
