import api from "./api";

export const compareProducts = async (productId1, productId2) => {
  const response = await api.post('/api/comparisons/items', { productId1, productId2 });
  return response.data;
};

export const quickCompareByName = async (name1, name2) => {
  const response = await api.get('/api/comparisons/quick', { params: { name1, name2 } });
  return response.data;
};

export const getComparisonHistory = async () => {
  const response = await api.get('/api/comparisons/items');
  return response.data;
};

export const getComparisonById = async (id) => {
  const response = await api.get(`/api/comparisons/items/${id}`);
  return response.data;
};

export const updateComparison = async (id, data) => {
  const response = await api.put(`/api/comparisons/items/${id}`, data);
  return response.data;
};

export const deleteComparison = async (id) => {
  const response = await api.delete(`/api/comparisons/items/${id}`);
  return response.data;
};

export const clearComparisonHistory = async () => {
  const response = await api.delete('/api/comparisons/items');
  return response.data;
};

export const getComparisonStats = async () => {
  const response = await api.get('/api/comparisons/stats');
  return response.data;
};
