import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

const productService = {
  async getAllProducts(params) {
    try {
      const response = await axios.get(API_URL, { params });
      // console.log("response", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return null;
    }
  },

  async getProductById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      return null;
    }
  },

  async createProduct(formData) {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      return null;
    }
  },

  async updateProduct(id, formData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  async deleteProduct(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      return false;
    }
  },
};

export default productService;
