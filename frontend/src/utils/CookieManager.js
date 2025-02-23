import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setToken = (token) => {
  cookies.set("token", token, { path: "/" });
};

export const getToken = () => {
  return cookies.get("token");
};

export const logout = () => {
  cookies.remove("token", { path: "/" });
};

export const setTempToken = (token) => {
  cookies.set("temp_token", token, { path: "/" });
};

export const clearTempToken = () => {
  cookies.remove("temp_token");
};

export const getTempToken = () => {
  return cookies.get("temp_token");
};

export const getStudentId = () => {
  return cookies.get("student_id");
};

export const setStudentId = (id) => {
  cookies.set("student_id", id, { path: "/" });
};

export const clearStudentId = () => {
  cookies.remove("student_id");
};
