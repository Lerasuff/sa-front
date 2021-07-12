export enum Actions {
  HTTP_REQUEST = 'HTTP_REQUEST',
  HTTP_RESPONSE = 'HTTP_RESPONSE',
  HTTP_ERROR = 'HTTP_ERROR',
  HTTP_GET = 'HTTP_GET',
  HTTP_POST = 'HTTP_POST',
  HTTP_PUT = 'HTTP_PUT',
  HTTP_DELETE = 'HTTP_DELETE',
  HTTP_SEARCH = 'HTTP_SEARCH',
  HTTP_CHECK_TOKEN = 'HTTP_CHECK_TOKEN',
  A_SERVICE_TOKEN = 'A_SERVICE_TOKEN',
  A_AUTH = 'A_AUTH',
  A_USER_ME = 'A_USER_TOKEN',
  A_LOGOUT = 'A_LOGOUT',
  A_USER_CREATE = 'A_USER_CREATE',
  A_USER_UPDATE = 'A_USER_UPDATE',
  A_USER_DELETE = 'A_USER_DELETE',
}

export enum Mutations {
  SET_LOADING = 'SET_LOADING',
  SET_AUTH = 'SET_AUTH',
  SET_LOGOUT = 'SET_LOGOUT',
  SET_HTTP_ERROR = 'SET_HTTP_ERROR',
  SET_USERS = 'SET_USERS',
  SET_BOARD = 'SET_BOARD',
  SET_DECK = 'SET_DECK',
  SET_STATUS = 'SET_STATUS',
  SET_WIN = 'SET_WIN',
  ADD_IN_DECK = 'ADD_IN_DECK',
  ADD_IN_BOARD = 'ADD_IN_BOARD',
  DELETE_FROM_DECK = 'DELETE_FROM_DECK',
  DELETE_FROM_BOARD = 'DELETE_FROM_BOARD',
  SET_TIME = 'SET_TIME',
  SET_HEALTH = 'SET_HEALTH',
  CLEAR_STATE = 'CLEAR_STATE',
}

export enum Getters {
  GET_LOADING = 'GET_LOADING',
  IS_LOADING = 'IS_LOADING',
}

export const urls = {
  [Actions.A_SERVICE_TOKEN]: '/oauth/token?client_id=:client_id:&scope=:scope:&grant_type=:grant_type:',
  [Actions.A_AUTH]: '/oauth/token?client_id=:client_id:&scope=:scope:&username=:username:&password=:password:&grant_type=:grant_type:',
  [Actions.A_USER_ME]: '/user/me',
  [Actions.A_USER_CREATE]: '',
  [Actions.A_USER_UPDATE]: '',
  [Actions.A_USER_DELETE]: ':id:',
};
