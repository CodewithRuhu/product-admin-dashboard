import axiosInstance from "../axiosInstance";

// DummyJSON ka login endpoint call karta hai.
// Success par ye { token, id, username, ... } jaisa object deta hai.
export async function loginUser(username, password) {
  const response = await axiosInstance.post("/auth/login", {
    username,
    password,
  });
  return response.data;
}