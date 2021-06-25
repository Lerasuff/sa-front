import Vue from 'vue'
import Vuex, {StoreOptions} from 'vuex'

Vue.use(Vuex)


const options: StoreOptions<Record<string, unknown>> = {
  strict: process.env.NODE_ENV !== 'production',
};

const store = new Vuex.Store<Record<string, unknown>>(options);

export default store;
