// services/axios.js
import axios from 'axios';
import store from '@/store'; // 导入 Vuex store

const instance = axios.create({
    baseURL: 'http://localhost:7001/api',
});

instance.interceptors.request.use((config) => {
    const token = store.state.token; // 从 Vuex 获取 token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;