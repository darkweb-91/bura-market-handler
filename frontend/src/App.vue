<template>
  <div :class="{ 'dark': isDark }" class="min-h-screen">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-200">
      <header class="bg-indigo-600 dark:bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row w-full justify-between items-center gap-4 sm:gap-0">
          <h1 class="text-xl font-bold">Bura Market</h1>
          <nav class="space-x-2 sm:space-x-4 flex items-center text-sm sm:text-base">
            <router-link to="/" class="hover:underline">Dashboard</router-link>
            <router-link to="/items" class="hover:underline">Inventory</router-link>
            <button @click="toggleDark" class="bg-indigo-500 dark:bg-gray-700 p-2 rounded-full hover:bg-indigo-700 dark:hover:bg-gray-600 transition flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10">
              <span v-if="isDark" class="text-sm sm:text-base">☀️</span>
              <span v-else class="text-sm sm:text-base">🌙</span>
            </button>
          </nav>
        </div>
      </header>
      
      <main class="flex-1 max-w-7xl mx-auto w-full p-4">
        <router-view />
      </main>

      <Chatbot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Chatbot from './components/Chatbot.vue';

const router = useRouter();
const isDark = ref(false);

onMounted(() => {
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true;
    document.documentElement.classList.add('dark');
  }
});

const toggleDark = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};
</script>
