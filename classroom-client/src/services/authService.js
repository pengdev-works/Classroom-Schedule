import { API } from "./api";

export const loginUser = (data) => API.post("/login", data);
export const registerUser = (data) => API.post("/register", data);
export const logoutUser = () => API.post("/logout");
export const getProfile = () => API.get("/me");