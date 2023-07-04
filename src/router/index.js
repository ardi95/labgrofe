import Vue from 'vue'
import VueRouter from 'vue-router'
import VueCookies from "vue-cookies";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    meta: {
      isAuth: false,
      coreSystem: 'NoCore'
    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      isAuth: true,
      coreSystem: 'CoreSystem'
    },
    component: () => import('../views/Home.vue')
  },
  {
    path: '/app-management',
    meta: {
      isAuth: true,
      coreSystem: 'CoreSystem'
    },
    component: () => import('@/components/Master.vue'),
    children: [
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/AppManagement/Users/Index.vue'),
      }
    ]
  },
  {
    path: '*',
    name: 'notFound',
    meta: {
      isAuth: false,
      isGlobal: true,
      coreSystem: 'NoCore'
    },
    component: () => import('@/views/NotFound.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const token = VueCookies.get("token");

  //console.log(to);
  if (to.matched[0].meta.isGlobal === true) {
    next();
  } else {
    if (to.matched[0].meta.isAuth === true) {
      if (!token) {
        next("/");
      } else {
        next();
      }
    } else {
      if (!token) {
        next();
      } else {
        next("/home");
      }
    }
  }
});

export default router
