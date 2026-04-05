import api from "./api";

// Register: backend expects { username, password, email, name }
// Frontend form has { name, email, password } — use email as username
export const register = (data) =>
  api.post("/users/register", {
    username: data.email,   // use email as unique username
    password: data.password,
    email: data.email,
    name: data.name,
  });

// Login: backend expects { username, password }
export const login = (data) =>
  api.post("/users/login", {
    username: data.email,   // consistent with register
    password: data.password,
  });

export const getDashboard = (userId) => api.get(`/dashboard/${userId}`);
