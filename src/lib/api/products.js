import axiosInstance from "../axiosInstance";

// Normal (non-search) product list — supports pagination + sort.
// signal: AbortController ka signal, taaki purani requests cancel ho sakein.
export async function getProducts({ limit, skip, sortBy, order, signal }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order || "asc";
  }
  const response = await axiosInstance.get("/products", { params, signal });
  return response.data; // { products, total, skip, limit }
}

// Category ke hisaab se product list.
export async function getProductsByCategory({ category, limit, skip, signal }) {
  const response = await axiosInstance.get(`/products/category/${category}`, {
    params: { limit, skip },
    signal,
  });
  return response.data;
}

// Search query se products dhoondhna.
export async function searchProducts({ q, limit, skip, signal }) {
  const response = await axiosInstance.get("/products/search", {
    params: { q, limit, skip },
    signal,
  });
  return response.data;
}

// Saari categories ki list (filter dropdown ke liye).
export async function getCategories() {
  const response = await axiosInstance.get("/products/categories");
  return response.data; // array of { slug, name, url }
}

// Ek single product ki details, id se.
export async function getProductById(id) {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
}

// Naya product add karna.
export async function addProduct(data) {
  const response = await axiosInstance.post("/products/add", data);
  return response.data;
}

// Product update/edit karna.
export async function updateProduct(id, data) {
  const response = await axiosInstance.put(`/products/${id}`, data);
  return response.data;
}

// Product delete karna.
export async function deleteProduct(id) {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
}