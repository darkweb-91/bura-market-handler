<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Dashboard</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Items</h3>
        <p class="text-3xl mt-2 text-gray-900 dark:text-white">{{ items.length }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Stock Value</h3>
        <p class="text-3xl mt-2 text-gray-900 dark:text-white">${{ totalValue.toFixed(2) }}</p>
      </div>
      <div class="bg-white dark:bg-gray-800 p-4 shadow rounded-lg">
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Potential Profit</h3>
        <p class="text-3xl mt-2 text-green-600 dark:text-green-400">${{ potentialProfit.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const items = ref<any[]>([]);

onMounted(async () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await fetch(`${API_BASE_URL}/api/items`);
  if (res.ok) {
    items.value = await res.json();
  }
});

const totalValue = computed(() => {
  return items.value.reduce((acc, item) => acc + (item.costPrice * item.stockCount), 0);
});

const potentialProfit = computed(() => {
  return items.value.reduce((acc, item) => acc + ((item.sellPrice - item.costPrice) * item.stockCount), 0);
});
</script>
