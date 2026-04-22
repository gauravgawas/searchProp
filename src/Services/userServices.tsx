import axios from "axios";

const login = async (auth: any, username: string, password: string) => {
  try {
    const response = await axios.post(
      auth.resourceUrl + "/api/users/login",
      { username, password },
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const register = async (
  auth: any,
  username: string,
  password: string,
  email: string,
) => {
  try {
    const response = await axios.post(
      auth.resourceUrl + "/api/users/register",
      { username, password, email },
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export default { login, register };
