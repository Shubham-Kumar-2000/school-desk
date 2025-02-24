import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setToken = (token) => {
  localStorage.setItem("token", JSON.stringify(token));
};

export const getToken = () => {
  const token = localStorage.getItem("token");
  try {
    return JSON.parse(token);
  } catch (error) {
    return token; // Handle cases where it's not JSON
  }
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const setTempToken = (token) => {
  localStorage.setItem("temp_token", JSON.stringify(token));
};

export const clearTempToken = () => {
  localStorage.removeItem("temp_token");
};

export const getTempToken = () => {
  const token = localStorage.getItem("temp_token");
  try {
    return JSON.parse(token);
  } catch (error) {
    return token;
  }
};

export const setStudentId = (id) => {
  localStorage.setItem("student_id", JSON.stringify(id));
};

export const getStudentId = () => {
  const id = localStorage.getItem("student_id");
  try {
    return JSON.parse(id);
  } catch (error) {
    return id;
  }
};

export const clearStudentId = () => {
  localStorage.removeItem("student_id");
};
