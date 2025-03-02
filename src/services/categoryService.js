import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/categories";

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.log("Lỗi khi lấy danh mục: ", error);
      throw error;
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  createCategory: async (formData) => {
    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Lỗi khi tạo danh mục: ", error);
      throw error;
    }
  },

  updateCategory: async (categoryId, formData) => {
    try {
      const response = await axios.put(`${API_URL}/${categoryId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Debug response
      // console.log("Update Response:", response);

      // if (!response.data) {
      //   throw new Error("No data received from server");
      // }

      return response.data;
    } catch (error) {
      console.error("Error in updateCategory service:", error);
      console.error("Error response:", error.response?.data);
      throw error;
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      await axios.delete(`${API_URL}/${categoryId}`);
    } catch (error) {
      console.log("Lỗi khi xóa danh mục: ", error);
      throw error;
    }
  },
};
