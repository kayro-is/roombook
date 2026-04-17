import { jwtDecode } from "jwt-decode";

export function getToken() {
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function getUserFromToken() {
  const token = getToken();

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Token invalide :", error);
    return null;
  }
}

export function isAuthenticated() {
  const user = getUserFromToken();

  if (!user) return false;

  if (user.exp) {
    const currentTime = Date.now() / 1000;
    return user.exp > currentTime;
  }

  return true;
}

export function isAdmin() {
  const user = getUserFromToken();
  return user?.role === "admin";
}