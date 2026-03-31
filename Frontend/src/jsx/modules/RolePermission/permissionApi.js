import axios from "axios";

const API = import.meta.env.VITE_BACKEND_API_URL;
const token = localStorage.getItem("token");

const headers = {
  Authorization: `Bearer ${token}`,
};

export const createPermission = (data) =>
  axios.post(`${API}permission/create-permission`, data, { headers });

export const getPermissions = () =>
  axios.get(`${API}permission/get-permission`, { headers });

export const deletePermission = (id) =>
  axios.delete(`${API}permission/${id}`, { headers });