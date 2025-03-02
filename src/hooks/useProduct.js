import { useState, useEffect } from "react";
import productService from "../services/productService";

const useProduct = (id = null) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId) => {
    setLoading(true);
    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    setLoading(true);
    try {
      const newProduct = await productService.createProduct(productData);
      return newProduct;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId, productData) => {
    setLoading(true);
    try {
      const updatedProduct = await productService.updateProduct(
        productId,
        productData
      );
      setProduct(updatedProduct);
      return updatedProduct;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId) => {
    setLoading(true);
    try {
      await productService.deleteProduct(productId);
      setProduct(null);
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    loading,
    error,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProduct;
