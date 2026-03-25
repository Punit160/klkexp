import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

// ✅ Fetch employee by ID
export const getEmployeeById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(`${BASE_URL}users/fetch-user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || res.data;
  } catch (error) {
    console.error("Fetch Employee Error:", error);
    throw error;
  }
};

// ✅ Update employee by ID
export const updateEmployee = async (id, formData) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(`${BASE_URL}users/update-user/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return { ok: true, result: res.data };
  } catch (error) {
    console.error("Update Employee Error:", error.response || error);
    return { ok: false, result: error.response?.data || error.message };
  }
};




export const getAllEmployees = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${BASE_URL}users/get-user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data || res.data;
};

export const deleteEmployee = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.delete(`${BASE_URL}users/delete-user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { ok: true, result: res.data };
  } catch (error) {
    console.error("Delete Employee Error:", error.response || error);
    return { ok: false, result: error.response?.data || error.message };
  }
};  