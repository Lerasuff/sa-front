import Vue from 'vue'
import VueRouter from 'vue-router'
import {BOARD, langs, LOGIN, routeNames} from "@/router/const";
import Login from "@/views/Login.vue";
import Board from "@/views/Board.vue";
import authModule from "@/store/modules/auth.module";

Vue.use(VueRouter)

const hasToken = (to, from, next) => {
  if (authModule.getters.token) {
    next('/');
  } else {
    authModule.mutations.SET_LOGOUT();
    next();
  }
}

const requireAuth = (to, from, next) => {
  if (authModule.getters.isLoggedIn) {
    next();
  } else if (from.name !== routeNames[LOGIN]) {
    next({name: routeNames[LOGIN]});
  } else {
    next(false);
  }
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: routeNames[LOGIN],
      component: Login,
      meta: {title: langs[LOGIN]},
      beforeEnter: hasToken
    },
    {
      path: '/',
      name: routeNames[BOARD],
      component: Board,
      meta: {title: langs[BOARD]},
      beforeEnter: (to, from, next) => requireAuth(to, from, next)
    }
  ]
})

export default router;
