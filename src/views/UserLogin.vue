<template>
    <div class="login-container">
        <div class="login-box">
            <h1>Photo Manager</h1>
            <h2>Login</h2>
            <form @submit.prevent="handleLogin" class="login-form">
                <input v-model="username" placeholder="Username" required class="input-field" />
                <input v-model="password" type="password" placeholder="Password" required class="input-field" />
                <button type="submit" class="login-button">Login</button>
            </form>
            <router-link to="/register" class="register-link">Don't have an account? Register</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { login } from '@/services/userService';

const username = ref('');
const password = ref('');
const store = useStore();
const router = useRouter();

const handleLogin = async () => {
    const result = await login(username.value, password.value);
    if (result.success) {
        const { token } = result;
        store.commit('setAuth', { token });
        router.push('/');
    } else {
        alert(result.message);
    }
};
</script>

<style scoped>
    .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f2f5;
    }

    .login-box {
        background-color: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
        width: 100%;
    }

    h1 {
        font-size: 24px;
        margin-bottom: 20px;
    }

    h2 {
        font-size: 18px;
        margin-bottom: 30px;
    }

    .login-form {
        display: flex;
        flex-direction: column;
    }

    .input-field {
        padding: 12px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
    }

    .login-button {
        background-color: #007bff;
        color: white;
        padding: 12px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .login-button:hover {
        background-color: #0056b3;
    }

    .register-link {
        margin-top: 20px;
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
        display: block;
    }

    .register-link:hover {
        text-decoration: underline;
    }
</style>