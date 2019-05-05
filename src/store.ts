import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    setLoggedIn: (state, payload) => {
      state.loggedIn = payload;
    }
  },
  actions: {
    changeLoggedInState: ({ commit }, payload) => {
      commit("setLoggedIn", payload);
    }
  }
});
