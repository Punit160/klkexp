import { apiClient } from "./apiClient";


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
  data.append("status", formData.status);

  if (formData.photo) {
    data.append("photo", formData.photo);
  }

  return apiClient("users/create-user", {
    method: "POST",
    body: data,
  });
};


export const getEmployees = async () => {
  return apiClient("users/get-user", {
    method: "GET",
  });
};