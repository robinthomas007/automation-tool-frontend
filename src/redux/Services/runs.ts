import axios from "./axios";

export const Runs = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/run?q=${searchTerm}`);
  return res.data;
};
export var eventSource: EventSource | undefined = undefined