export const getUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return {
    id: null,
    role: "user"
  };

  try {
    const tokenValue = token.split(".")[1];
    const decoded = JSON.parse(atob(tokenValue));
    return {
      id: decoded.id || null,
      role: decoded.role || "user"
    };
  } catch (error) {
    console.error("Ошибка декодирования токена:", error);
    return { id: null, role: "user" };
  }
};
