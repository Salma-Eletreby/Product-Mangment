<script setup lang="ts">
import { ref, onMounted } from "vue";
import ProductService from "../../controllers/product-repo.ts";

const productService = new ProductService();
let products = ref<any[]>([]);
const errorMessage = ref<string | null>(null);

const editingProduct = ref<any | null>(null);

const fetchProducts = async () => {
  try {
    let temp = await productService.getProducts();
    products.value = temp.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    errorMessage.value = "Failed to load products.";
  }
};

onMounted(fetchProducts);

const deleteProduct = async (productID: string) => {
  try {
    let response = await productService.deleteProduct(productID);
    
    if (JSON.parse(response.body).success) {
      alert("Product deleted successfully!");
      fetchProducts();
    } else {
      alert("Error deleting product: " + response.body);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    errorMessage.value = "Failed to delete product.";
  }
};

const editProduct = (product: any) => {
  editingProduct.value = { ...product };
};

const updateProduct = async () => {
  if (editingProduct.value) {
    try {
      let response = await productService.updateProduct(editingProduct.value);

      if (JSON.parse(response.body).success) {
        alert("Product updated successfully!");
        editingProduct.value = null;
        fetchProducts();
      } else {
        alert("Error updating product: " + response.body);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      errorMessage.value = "Failed to update product.";
    }
  }
};
</script>

<template>
  <div>
    <router-link to="/create-product">Create Product</router-link>
    <h1>Product List</h1>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    
    <!-- Product Table -->
    <table class="product-table">
      <thead>
        <tr>
          <th>Product ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Stock Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.product_id">
          <td>{{ product.product_id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>${{ product.price }}</td>
          <td>{{ product.stock_quantity }}</td>
          <td>
            <button @click="editProduct(product)">Edit</button>
            <button @click="deleteProduct(product.product_id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="editingProduct" class="edit-form">
      <h2>Edit Product</h2>
      <form @submit.prevent="updateProduct">
        <div>
          <label for="name">Name</label>
          <input v-model="editingProduct.name" id="name" type="text" required />
        </div>
        <div>
          <label for="description">Description</label>
          <input v-model="editingProduct.description" id="description" type="text" required />
        </div>
        <div>
          <label for="price">Price</label>
          <input v-model="editingProduct.price" id="price" type="number" step="0.01" required />
        </div>
        <div>
          <label for="stock_quantity">Stock Quantity</label>
          <input v-model="editingProduct.stock_quantity" id="stock_quantity" type="number" required />
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" @click="editingProduct = null">Cancel</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.product-table th,
.product-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}

.product-table th {
  background-color: #f4f4f4;
  color: black;
}

.error {
  color: red;
  font-weight: bold;
}

.edit-form {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  color: black;
}

.edit-form form div {
  margin-bottom: 10px;
}

.edit-form label {
  display: block;
  margin-bottom: 5px;
}

.edit-form input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.edit-form button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.edit-form button[type="button"] {
  background-color: #f44336;
}
</style>
