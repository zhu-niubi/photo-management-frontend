<template>
    <div class="register-container">
        <div class="register-box">
            <h2>Register</h2>
            <form @submit.prevent="handleRegister" class="register-form">
                <input v-model="username" placeholder="Username" required class="input-field" />
                <input v-model="password" type="password" placeholder="Password" required class="input-field" />
                <input v-model="phone" placeholder="Phone" required class="input-field" />
                <button type="submit" class="register-button">Register</button>
            </form>
            <router-link to="/login" class="login-link">Already have an account? Login</router-link>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/services/userService';

const username = ref('');
const password = ref('');
const phone = ref('');
const router = useRouter();

const handleRegister = async () => {
    const result = await register(username.value, password.value, phone.value);
    if (result.success) {
        router.push('/login');
    } else {
        alert(result.message);
    }
};
</script>

<style scoped>
    .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f0f2f5;
    }

    .register-box {
        background-color: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
        max-width: 400px;
        width: 100%;
    }

    h2 {
        font-size: 24px;
        margin-bottom: 20px;
    }

    .register-form {
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

    .register-button {
        background-color: #28a745;
        color: white;
        padding: 12px;
        font-size: 16px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .register-button:hover {
        background-color: #218838;
    }

    .login-link {
        margin-top: 20px;
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
        display: block;
    }

    .login-link:hover {
        text-decoration: underline;
    }
</style>