<template>
  <div class="app">
    <h1>Create Product</h1>
    <form @submit.prevent="handleSubmit">
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="name" />
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description"></textarea>
      </div>

      <div>
        <label for="price">Price:</label>
        <input type="number" id="price" v-model="price" />
      </div>

      <div>
        <label for="stock_quantity">Stock Quantity:</label>
        <input type="number" id="stock_quantity" v-model="stockQuantity" />
      </div>

      <p v-if="error" style="color: red">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? "Submitting..." : "Submit" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProductService from "../../controllers/product-repo.ts";
import { onMounted } from 'vue';

const productService = new ProductService();

const name = ref("");
const description = ref("");
const price = ref("");
const stockQuantity = ref("");
const error = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  if (!name.value || !description.value || !price.value || !stockQuantity.value) {
    error.value = "All fields are required.";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const newProduct = {
      name: name.value,
      description: description.value,
      price: parseFloat(price.value), // Ensure the price is a number
      stock_quantity: parseInt(stockQuantity.value, 10), // Ensure the stock quantity is an integer
    };

    const response = await productService.createProduct(newProduct);

    if (response.body.success) {
      alert("Product created successfully!");
    } else {
      alert("Error creating product: " + response.body);
    }
  } catch (err) {
    error.value = "An error occurred: " + err.message;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
}

form div {
  margin-bottom: 10px;
}

button:disabled {
  background-color: #ccc;
}

button {
  padding: 10px 15px;
  font-size: 16px;
}
</style>
