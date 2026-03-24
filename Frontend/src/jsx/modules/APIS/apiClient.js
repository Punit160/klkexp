export const apiClient = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_API_URL}${url}`,
    {
      ...options,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers,
      },
    }
  );

  let data;

  try {
    data = await response.json();
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
    throw new Error("Invalid JSON response from server");
  }

  if (!response.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};