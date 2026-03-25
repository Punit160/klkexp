// src/employee/APIS.js
const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

// Get auth token
const getToken = () => localStorage.getItem("token");

// ✅ CREATE EMPLOYEE
export const createEmployee = async (formData) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}users/create-user`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const result = await res.json();
    return { ok: res.ok, result };
  } catch (err) {
    return { ok: false, result: { message: err.message } };
  }
};

// ✅ GET ALL EMPLOYEES
export const getEmployees = async () => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}users/get-user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();

    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((emp) => ({
        ...emp,
        status:
          emp.status === "1" || emp.status === 1 || emp.status === "Active"
            ? "Active"
            : "Inactive",
        phone_no: emp.phone_no || "N/A",
      }));
    }

    return { ok: res.ok, result };
  } catch (err) {
    return { ok: false, result: { message: err.message } };
  }
};

// ✅ GET SINGLE EMPLOYEE BY ID
export const getEmployeeById = async (id) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}users/fetch-user/${id}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();

    if (result.data) {
      return {
        ...result.data,
        status: result.data.status === 1 || result.data.status === "1" ? "Active" : "Inactive",
        phone_no: result.data.phone_no || "",
      };
    }
    return {};
  } catch (err) {
    console.error(err);
    return {};
  }
};

// ✅ UPDATE EMPLOYEE
export const updateEmployee = async (id, formData) => {
  try {
    const token = getToken();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "phone") data.append("phone_no", value);
        else data.append(key, value);
      }
    });

    const res = await fetch(`${BASE_URL}users/update-user/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: data,
    });

    const result = await res.json();
    return { ok: res.ok, result };
  } catch (err) {
    return { ok: false, result: { message: err.message } };
  }
};

// ✅ DELETE EMPLOYEE
export const deleteEmployee = async (id) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}users/delete-user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    return { ok: res.ok, result };
  } catch (err) {
    return { ok: false, result: { message: err.message } };
  }
};

// ✅ CHANGE EMPLOYEE STATUS
export const changeEmployeeStatus = async (id, status) => {
  try {
    const token = getToken();
    const res = await fetch(`${BASE_URL}users/change/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const result = await res.json();
    return { ok: res.ok, result };
  } catch (err) {
    return { ok: false, result: { message: err.message } };
  }
};