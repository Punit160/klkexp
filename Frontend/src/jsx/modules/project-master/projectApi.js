const BASE_URL = import.meta.env.VITE_BACKEND_API_URL;

const getToken = () => localStorage.getItem("token");

/* ================= CREATE PROJECT ================= */
export const createProject = async (formData) => {
  const response = await fetch(`${BASE_URL}projects/create-project`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  return response.json();
};

/* ================= GET ALL PROJECTS ================= */
export const getAllProjects = async () => {
  const res = await fetch(`${BASE_URL}projects/get-projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    credentials: "include",
  });

  return res.json();
};

/* ================= GET PROJECT BY ID ================= */
export const getProjectById = async (id) => {
  const res = await fetch(`${BASE_URL}projects/fetch-project/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};

/* ================= UPDATE PROJECT ================= */
export const updateProject = async (id, formData) => {
  const res = await fetch(`${BASE_URL}projects/update-project/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  return res.json();
};

/* ================= DELETE PROJECT ================= */
export const deleteProject = async (id) => {
  const res = await fetch(`${BASE_URL}projects/delete-project/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.json();
};