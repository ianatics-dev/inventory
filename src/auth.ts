export const clearAuthStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("unit");
  localStorage.removeItem("id");
  localStorage.removeItem("role");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
};

export const logoutAndRedirect = () => {
  clearAuthStorage();
  window.location.href = "/login";
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

export const getUserRole = () => {
  return localStorage.getItem("role"); // you must store this on login
};