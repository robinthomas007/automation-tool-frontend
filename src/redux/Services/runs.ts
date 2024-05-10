import axios from "./axios";

export const Runs = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/run?q=${searchTerm}`);
  return res.data;
};
export const CreateRun = async (projectId: number, body: any) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/run`,body);
  return res.data;
};
export const SignalRun = async (runId: number, body: any) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/run/${runId}/signal`,body);
  return res.data;
};