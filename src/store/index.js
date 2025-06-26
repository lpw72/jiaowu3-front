import { createStore } from 'vuex';
import api from '../utils/api..js';

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    userRole: localStorage.getItem('userRole') || '',
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    SET_USER_ROLE(state, role) {
      state.userRole = role;
      localStorage.setItem('userRole', role);
    },
  },
  actions: {
    async login({ commit }, payload) {
      const response = await api.post('/login/', payload);
      // 存储 access token
      commit('SET_TOKEN', response.data.access);
      // 如有 role 字段可存储，否则可忽略
      if (response.data.role) {
        commit('SET_USER_ROLE', response.data.role);
      }
      return response;
    },
    logout({ commit }) {
      commit('SET_TOKEN', '');
      commit('SET_USER_ROLE', '');
    },
  },
  getters: {
    isAuthenticated: state => !!state.token,
    getUserRole: state => state.userRole,
  },
});