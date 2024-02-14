import axios from "./axios";
import { Step } from './../Slice/stepsSlice'

export const Steps = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/step?q=${searchTerm}`);
  return res.data;
};

export const CreateSteps = async (projectId:number,steps: Step) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/step`, steps);
  return res.data;
};