import jwt_decode from 'jwt-decode';
import { configs } from '@/const/config.ts';
import router from '@/router/index.ts';
import { LOGIN, routeNames } from '@/router/const';
import { Actions, Mutations, urls } from '@/store/consts';
import requestModule, { wrapUrl } from '@/store/modules/request.module';
import { createModule } from 'vuexok';
import store from '@/store';

interface User {
  exp: number;
  userName: string;
  authorities: string[];
  jti: string[];
  client_id: string;
  scope: string[];
}

class AuthState {
  token: string | null = localStorage.getItem('token');
  user: User | null = decodeUser(this.token);
}

const decodeUser = (token: string | null): User | null => {
  if (token) {
    return jwt_decode(token);
  } else {
    return null;
  }
};

const authModule = createModule(store, 'auth', {
  namespaced: true,
  state: new AuthState(),
  getters: {
    isLoggedIn: (state) => {
      if (!state.token || !state.user) return false;
      const exp = state.user.exp;
      const now = new Date().getTime() / 1000;
      return now < exp;
    },
    token: (state) => state.token,
    user: (state) => state.user,
  },
  mutations: {
    [Mutations.SET_AUTH](state, { accessToken }) {
      state.token = accessToken;
      state.user = decodeUser(accessToken);
      localStorage.setItem('token', accessToken);
    },
    [Mutations.SET_LOGOUT](state) {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
    },
  },
  actions: {
    [Actions.A_AUTH]: (ctx, data) => {
      const params = {
        username: data.username,
        password: data.password,
        scope: 'read write',
        client_id: 'sa',
        grant_type: 'password',
      };
      return requestModule.actions
        .HTTP_REQUEST({
          mutation: false,
          method: Actions.A_AUTH,
          options: {
            method: 'POST',
            baseURL: configs.ports.ssoApp,
            auth: {
              username: 'sa',
              password: 'secret',
            },
            url: wrapUrl(urls[Actions.A_AUTH], params),
          },
        })
        .then((response) => {
          const { access_token } = response;
          authModule.mutations.SET_AUTH({
            accessToken: `${access_token}`,
          });
        });
    },
    [Actions.A_LOGOUT]: () => {
      authModule.mutations.SET_LOGOUT();
      if (router.currentRoute.name !== routeNames[LOGIN]) router.push({ name: routeNames[LOGIN] });
    },
  },
});

export default authModule;
