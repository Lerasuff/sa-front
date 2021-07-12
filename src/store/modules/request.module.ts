import Vue from 'vue';
import axios from 'axios';
import comparisonOperators from '@/const/comparisonQueryOperators.ts';
import { BASE_URL } from '@/const/config.ts';
import { Actions, Mutations, Getters, urls } from '@/store/consts.ts';
import { StatusCodes } from 'http-status-codes';
import { createModule } from 'vuexok';
import store from '@/store/index.ts';
import authModule from '@/store/modules/auth.module.ts';
import { ErrorMessage } from '@/const/translationOfErrors';

enum Methods {
  POST = 'POST',
  GET = 'GET',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

interface Errors {
  error?: string;
  error_description?: string;
  message?: string;
}

class RequestState {
  headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  };
  loading: { [key: string]: string } | Record<string, never> = {};
  loadingRequest: { [key: string]: string } | Record<string, never> = {};
  errors: Record<string, unknown> = {};
  errorsQueue: Errors[] = [];
}

const api = axios.create({
  baseURL: BASE_URL,
});

const notificationErrors = <T extends Errors>(error: T, status: number | undefined): void => {
  if (!error) return;

  let message: string | undefined;

  if (error.message) {
    message = error.message;
  } else {
    message = error.error_description;
  }

  if (!message) return;

  if (ErrorMessage[message]) message = ErrorMessage[message];

  if (status === StatusCodes.INTERNAL_SERVER_ERROR) {
    Vue.$toast.error(message);
  } else {
    Vue.$toast.warning(message);
  }
};

export const wrapUrl = (url: string | undefined, params: Record<string, any> | undefined): string => {
  if (!url) {
    console.log('ERROR URL', url, params);
    return '';
  }
  if (!params) {
    return url;
  }
  let path: string = url;
  for (const key of Object.keys(params)) {
    path = path.replace(`:${key}:`, params[key]);
  }
  return encodeURI(path);
};

const convertSearchToString = (searchParams: Record<string, any>): string => {
  const searchKeys: string[] = Object.keys(searchParams).filter((key) => searchParams[key]);
  return searchKeys
    .map((searchKey) => {
      const isNotString: boolean = typeof searchParams[searchKey] !== 'string';
      const isNotNumber: boolean = typeof searchParams[searchKey] !== 'number';

      if (isNotString && isNotNumber) {
        return Object.keys(searchParams[searchKey])
          .map((paramKey) => {
            return `${searchKey}${comparisonOperators[paramKey]}${searchParams[searchKey][paramKey]}`;
          })
          .join('^');
      } else {
        return `${searchKey}${comparisonOperators.$eq}${searchParams[searchKey]}`;
      }
    })
    .join('^');
};

const requestModule = createModule(store, 'request', {
  namespaced: true,
  state: new RequestState(),
  getters: {
    getHeaders: (state) => state.headers,
    [Getters.IS_LOADING]: (state) => {
      return Object.values(state.loading).includes('loading');
    },
    [Getters.GET_LOADING]: (state) => (name) => state.loading[name] || 'empty',
  },
  mutations: {
    [Mutations.SET_LOADING]: (state, { name, value, data }) => {
      console.log(Mutations.SET_LOADING, name, value, data);
      Vue.set(state.loading, name, value);
      Vue.set(state.loadingRequest, name, data);
    },
    [Mutations.SET_HTTP_ERROR]: (state, data) => {
      Vue.set(state.errors, data.name, data.data.errors);
      state.errorsQueue.push(data);
      notificationErrors(data.data, data.status);
      console.error(Mutations.SET_HTTP_ERROR, data);
    },
  },
  actions: {
    [Actions.HTTP_CHECK_TOKEN]: async (ctx, { method, mutation, options }) => {
      if (!options.headers) {
        options.headers = {};
      }

      if (!authModule.getters.token) {
        await authModule.actions.A_LOGOUT();
        return Promise.reject(false);
      }
      const exp = authModule.getters.user ? authModule.getters.user.exp : undefined;
      const now = new Date().getTime() / 1000;
      if (exp && now > exp) {
        await authModule.actions.A_LOGOUT();
        return Promise.reject(false);
      }

      options.headers.Authorization = authModule.getters.token;

      return requestModule.actions.HTTP_REQUEST({ method, mutation, options });
    },
    [Actions.HTTP_REQUEST]: async (ctx, { method, mutation, options }) => {
      requestModule.mutations.SET_LOADING({ name: method, value: 'loading' });
      if (!options.headers) {
        options.headers = {};
      }
      options.headers = { ...options.headers };
      return api
        .request(options)
        .then((response) => requestModule.actions.HTTP_RESPONSE({ method, mutation, response }))
        .catch((req) => {
          requestModule.mutations.SET_LOADING({ name: method, value: 'error', data: req });
          return requestModule.actions.HTTP_ERROR({ req, method });
        });
    },
    [Actions.HTTP_RESPONSE]: (ctx, { response, method, mutation }) => {
      response = response.data;
      if (mutation === null || mutation === undefined) {
        requestModule.mutations.SET_LOADING({ name: method, value: 'mutation undefined', data: response });
      } else {
        if (mutation) {
          if (response.content || response.result || response.orders) {
            const result = response.content || response.result || response.orders;
            if (mutation !== false) {
              requestModule.mutations[mutation](result);
            }
            requestModule.mutations.SET_LOADING({ name: method, value: 'loaded', data: result });
          } else if (response.id) {
            requestModule.mutations.SET_LOADING({ name: method, value: 'loaded', data: response });
            requestModule.mutations[mutation](response);
          } else {
            requestModule.mutations.SET_LOADING({ name: method, value: 'loaded', data: response });
            requestModule.mutations[mutation](response);
          }
        } else {
          requestModule.mutations.SET_LOADING({ name: method, value: 'loaded', data: response });
        }
      }
      return response;
    },
    [Actions.HTTP_ERROR]: (ctx, { req, method }) => {
      if (req.response) {
        const response = req.response;
        switch (response.status) {
          case StatusCodes.UNAUTHORIZED:
            authModule.actions.A_LOGOUT();
            break;
          case StatusCodes.INTERNAL_SERVER_ERROR:
          case StatusCodes.NOT_FOUND:
          case StatusCodes.BAD_REQUEST:
          default:
            requestModule.mutations.SET_HTTP_ERROR({
              name: method,
              data: response.data,
              status: response.status,
            });
            break;
        }
        return Promise.reject(response.data);
      } else {
        requestModule.mutations.SET_HTTP_ERROR({ name: method, data: req, status: undefined });
        return Promise.reject(req);
      }
    },
    [Actions.HTTP_GET]: (ctx, { method, mutation, params, data, options }) => {
      if (!options) {
        options = {};
      }
      options = {
        method: Methods.GET,
        url: wrapUrl(urls[method], params),
        data,
        ...options,
      };
      return requestModule.actions.HTTP_CHECK_TOKEN({ method, mutation, options });
    },
    [Actions.HTTP_POST]: (ctx, { method, mutation, params, data, options }) => {
      const opts = {
        ...options,
        method: Methods.POST,
        url: wrapUrl(urls[method], params),
        data,
      };
      return requestModule.actions.HTTP_CHECK_TOKEN({ method, mutation, options: opts });
    },
    [Actions.HTTP_PUT]: (ctx, { method, mutation, params, data }) => {
      const options = {
        method: Methods.PUT,
        url: wrapUrl(urls[method], params),
        data,
      };
      return requestModule.actions.HTTP_CHECK_TOKEN({ method, mutation, options });
    },
    [Actions.HTTP_DELETE]: (ctx, { method, mutation, params, data }) => {
      const options = {
        method: Methods.DELETE,
        url: wrapUrl(urls[method], params),
        data,
      };
      return requestModule.actions.HTTP_CHECK_TOKEN({ method, mutation, options });
    },
    [Actions.HTTP_SEARCH]: (ctx, { method, mutation, params, data }) => {
      if (!params) {
        params = {};
      }
      params = {
        ...params,
        page: params.page ? params.page - 1 : 0,
        size: params.size || 10,
        sort: params.sort || {},
        search: params.search || {},
      };
      const searchParams = Object.keys(params.search).filter((key) => params.search[key]);
      if (searchParams.length > 0) {
        params.search = convertSearchToString(params.search);
      } else {
        params.search = '';
      }
      const sortParams = Object.keys(params.sort).filter((key) => params.sort[key]);
      if (sortParams.length > 0) {
        params.sort =
          '&sort=' +
          sortParams
            .map((param) => {
              return `${param},${params.sort[param]}`;
            })
            .join('&sort=');
      } else {
        params.sort = '';
      }
      return requestModule.actions.HTTP_GET({ method, mutation, params, data });
    },
  },
});

export default requestModule;
