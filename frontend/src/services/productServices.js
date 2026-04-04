import api from "./api";

export const addProduct = async (formData) => {
  // Pass formData directly. Axios sets Content-Type to multipart/form-data automatically.
  const response = await api.post("/api/products/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllProducts = async () => {
  const response = await api.get("/api/products/");
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`/api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};

export const searchProducts = async (name) => {
  const response = await api.get(`/api/products/search?name=${encodeURIComponent(name)}`);
  return response.data;
};