<template>
    <div id="main-layout">
        <main>
            <router-view></router-view>
        </main>
    </div>
</template>

<script setup>


</script>

<style scoped>
    #main-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    nav {
        padding: 10px;
        color: white;
    }

    main {
        flex: 1;
        padding: 20px;
    }
</style>