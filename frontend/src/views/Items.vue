<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Inventory Items</h2>
      <router-link to="/items/add" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700">Add Item</router-link>
    </div>
    
    <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
      <ul class="divide-y divide-gray-200 dark:divide-gray-700">
        <li v-for="item in items" :key="item.id">
          <div class="px-4 py-4 flex flex-col sm:flex-row sm:items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <div class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
              <div class="flex items-center w-full sm:w-auto">
                <img v-if="item.imageUrl" :src="getImageUrl(item.imageUrl)" alt="" class="h-16 w-16 sm:h-12 sm:w-12 rounded-lg sm:rounded-full object-cover mr-4 border dark:border-gray-600" />
                <div v-else class="h-16 w-16 sm:h-12 sm:w-12 rounded-lg sm:rounded-full bg-gray-200 dark:bg-gray-600 mr-4 flex items-center justify-center text-xs sm:text-sm text-gray-500 dark:text-gray-300">No Img</div>
                <div class="flex-1">
                  <p class="text-base sm:text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">{{ item.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ item.category }}</p>
                </div>
              </div>
              <div class="mt-4 sm:mt-0 flex gap-4 text-sm text-gray-700 dark:text-gray-300 w-full sm:w-auto justify-between sm:justify-end">
                <div class="flex flex-col sm:items-end">
                  <span>Cost: ${{ item.costPrice }}</span>
                  <span>Sell: ${{ item.sellPrice }}</span>
                </div>
                <div class="flex flex-col sm:items-end border-l border-gray-200 dark:border-gray-600 pl-4">
                  <span>Stock: {{ item.stockCount }}</span>
                  <button @click="deleteItem(item.id)" class="text-red-500 dark:text-red-400 hover:underline mt-1 text-left sm:text-right">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </li>
        <li v-if="items.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">No items found.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const items = ref<any[]>([]);
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

const fetchItems = async () => {
  const res = await fetch(`${API_BASE_URL}/api/items`);
  if (res.ok) {
    items.value = await res.json();
  }
};

onMounted(fetchItems);

const deleteItem = async (id: number) => {
  if (confirm('Are you sure you want to delete this item?')) {
    const res = await fetch(`${API_BASE_URL}/api/items/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) fetchItems();
  }
};
</script>
