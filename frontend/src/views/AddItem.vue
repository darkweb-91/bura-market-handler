<template>
  <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 shadow sm:rounded-md text-gray-900 dark:text-gray-100">
    <h2 class="text-2xl font-bold mb-4">Add New Item</h2>
    
    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium">Name</label>
        <input v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm p-2 border" />
      </div>

      <div>
        <label class="block text-sm font-medium">Category</label>
        <select v-model="form.category" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm p-2 border">
          <option value="WOMAN">Woman</option>
          <option value="MAN">Man</option>
          <option value="ACCESSORY">Accessory</option>
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium">Cost Price</label>
          <input v-model="form.costPrice" type="number" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm p-2 border" />
        </div>
        <div>
          <label class="block text-sm font-medium">Sell Price</label>
          <input v-model="form.sellPrice" type="number" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm p-2 border" />
        </div>
        <div>
          <label class="block text-sm font-medium">Stock Count</label>
          <input v-model="form.stockCount" type="number" required class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm p-2 border" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium">Description</label>
        <textarea v-model="form.description" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm p-2 border"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium">Image (Tap to open Camera on Mobile)</label>
        <!-- Use capture="environment" to use camera on mobile -->
        <input @change="handleFile" type="file" accept="image/*" capture="environment" class="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900 dark:file:text-indigo-200 hover:file:bg-indigo-100" />
      </div>

      <div class="pt-4">
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 w-full sm:w-auto">Save Item</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  category: 'WOMAN',
  costPrice: 0,
  sellPrice: 0,
  stockCount: 0,
  description: ''
});

const imageFile = ref<File | null>(null);

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    imageFile.value = target.files[0];
  }
};

const submitForm = async () => {
  const formData = new FormData();
  formData.append('name', form.value.name);
  formData.append('category', form.value.category);
  formData.append('costPrice', form.value.costPrice.toString());
  formData.append('sellPrice', form.value.sellPrice.toString());
  formData.append('stockCount', form.value.stockCount.toString());
  formData.append('description', form.value.description);
  
  if (imageFile.value) {
    formData.append('image', imageFile.value);
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const res = await fetch(`${API_BASE_URL}/api/items`, {
    method: 'POST',
    body: formData
  });

  if (res.ok) {
    router.push('/items');
  } else {
    alert('Failed to add item');
  }
};
</script>
