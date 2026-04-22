import axios from "axios";

const getMyGeom = async (auth: any, param: any) => {
  try {
    const response = await axios.post(
      auth.resourceUrl + "/api/geometry/getMyGeom",
      param,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("GetMyGeom error:", error);
    throw error;
  }
};

const saveGeom = async (auth: any, param: any) => {
  try {
    const response = await axios.post(
      auth.resourceUrl + "/api/geometry/saveGeom",
      param,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("SaveGeom error:", error);
    throw error;
  }
};

const getAllGeom = async (auth: any) => {
  try {
    const response = await axios.get(
      auth.resourceUrl + "/api/geometry/getAllGeom",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response;
  } catch (error) {
    console.error("SaveGeom error:", error);
    throw error;
  }
};
export default { getMyGeom, saveGeom, getAllGeom };
