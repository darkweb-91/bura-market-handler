<template>
  <div class="fixed bottom-4 right-4 z-50">
    <!-- Chat Toggle Button -->
    <button v-if="!isOpen" @click="isOpen = true" class="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 transition">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </button>

    <!-- Chat Window -->
    <div v-else class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 sm:w-96 flex flex-col border dark:border-gray-700 overflow-hidden h-[400px] sm:h-[500px] max-h-[80vh]">
      <div class="bg-indigo-600 dark:bg-gray-900 text-white p-3 flex justify-between items-center">
        <h3 class="font-bold">AI Helper Bot</h3>
        <button @click="isOpen = false" class="text-white hover:text-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div class="flex-1 p-3 overflow-y-auto bg-gray-50 dark:bg-gray-800 flex flex-col gap-3">
        <div v-for="(msg, index) in messages" :key="index" :class="msg.role === 'user' ? 'self-end bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100' : 'self-start bg-white dark:bg-gray-700 border dark:border-gray-600 text-gray-800 dark:text-gray-200'" class="p-2 rounded-lg max-w-[80%] text-sm shadow-sm">
          {{ msg.content }}
        </div>
        <div v-if="isLoading" class="self-start text-xs text-gray-400 dark:text-gray-500 italic">Bot is thinking...</div>
      </div>

      <div class="p-3 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex">
        <input v-model="inputText" @keyup.enter="sendMessage" type="text" placeholder="Ask about inventory..." class="flex-1 border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
        <button @click="sendMessage" :disabled="isLoading || !inputText.trim()" class="bg-indigo-600 dark:bg-indigo-700 text-white px-3 py-2 rounded-r-md disabled:bg-indigo-300 dark:disabled:bg-indigo-900">
          Send
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
const inputText = ref('');
const messages = ref<{role: 'user' | 'bot', content: string}[]>([
  { role: 'bot', content: 'Hi! I am your AI assistant. I know about your current inventory stats. How can I help you today?' }
]);
const isLoading = ref(false);

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return;

  const userMsg = inputText.value;
  messages.value.push({ role: 'user', content: userMsg });
  inputText.value = '';
  isLoading.value = true;

  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const res = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMsg })
    });
    
    const data = await res.json();
    if (res.ok) {
      messages.value.push({ role: 'bot', content: data.reply });
    } else {
      messages.value.push({ role: 'bot', content: `Error: ${data.error}` });
    }
  } catch (err) {
    messages.value.push({ role: 'bot', content: 'Network error communicating with AI.' });
  } finally {
    isLoading.value = false;
  }
};
</script>
