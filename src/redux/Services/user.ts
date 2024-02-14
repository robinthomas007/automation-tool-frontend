import axios from "./axios";
export const me = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/me`);
  return res.data;
};
