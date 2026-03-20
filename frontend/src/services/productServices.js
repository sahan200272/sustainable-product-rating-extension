import api from "./api";

export const addProduct = async(data) => {
    const response = await api.post("/api/products/", data);

    return response;
}