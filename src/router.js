import Vue from 'vue'
import VueRouter from 'vue-router'


import Home from './views/Home.vue'
import HelloWorld from './components/HelloWorld.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/hello',
    name: 'HelloWorld',
    component: HelloWorld
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
