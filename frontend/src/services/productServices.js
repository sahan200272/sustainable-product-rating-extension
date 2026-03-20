import api from "./api";

export const addProduct = async (data) => {
  // Send data as JSON (no files in basic form)
  const response = await api.post("/api/products/", data);
  return response.data;
};