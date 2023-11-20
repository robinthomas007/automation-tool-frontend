import axios from "./axios";
export const Resources = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/resources`);
  return res.data;
};
