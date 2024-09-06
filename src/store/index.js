// store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('token'),
        user: null,
        token: localStorage.getItem('token') || null, // 添加 token 到 state
    },
    mutations: {
        setAuth(state, { user, token }) {
            state.isAuthenticated = true;
            state.user = user;
            state.token = token; // 设置 token
            localStorage.setItem('token', token); // 存储 token 到 localStorage
        },
        clearAuth(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null; // 清除 token
            localStorage.removeItem('token');
        },
    },
});