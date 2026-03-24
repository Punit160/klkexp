import { apiClient } from "./apiClient";

// CREATE
export const createEmployee = async (formData) => {
  const data = new FormData();

  data.append("username", formData.empName);
  data.append("email", formData.empEmail);
  data.append("password", formData.password);
  data.append("reporting_head", formData.reportingHead);
  data.append("doj", formData.doj);
  data.append("dol", formData.dol);
  data.append("ctc", formData.ctc);
  data.append("phone_no", formData.phone);
  data.append("designation", formData.designation);
  data.append("dob", formData.dob);
  data.append("gender", formData.gender);
  data.append("qualification", formData.qualification);
  data.append("status", formData.status === "Active");

  if (formData.photo) {
    data.append("photo", formData.photo);
  }

  return apiClient("users/create-user", {
    method: "POST",
    body: data,
  });
};

// GET ALL
export const getEmployees = async () => {
  return apiClient("users/get-user", { method: "GET" });
};

// GET SINGLE
export const getEmployeeById = async (id) => {
  return apiClient(`users/fetch-user/${id}`, { method: "GET" });
};

// UPDATE
// UPDATE
export const updateEmployee = async (id, formData) => {
  const data = new FormData();

  data.append("empName", formData.empName);       
  data.append("empEmail", formData.empEmail);       
  data.append("reportingHead", formData.reportingHead);
  data.append("doj", formData.doj);
  data.append("dol", formData.dol || "");
  data.append("ctc", formData.ctc || "");
  data.append("phone", formData.phone);           
  data.append("designation", formData.designation);
  data.append("dob", formData.dob || "");
  data.append("gender", formData.gender);
  data.append("qualification", formData.qualification);
  data.append("status", formData.status);           

  // Password only if filled
  if (formData.password) {
    data.append("password", formData.password);
  }

  // Photo only if new file selected
  if (formData.photo instanceof File) {
    data.append("photo", formData.photo);
  }

  return apiClient(`users/update-user/${id}`, {
    method: "PUT",
    body: data,
  });
};
// DELETE
export const deleteEmployee = async (id) => {
  return apiClient(`users/delete-user/${id}`, {
    method: "DELETE",
  });
};