import axios from "./axios";
export const users = async () => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  return res.data;
};
