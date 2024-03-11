import axios from "./axios";
import { Step } from './../Slice/stepsSlice'

export const Steps = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/step?q=${searchTerm}`);
  return res.data;
};

export const CreateSteps = async (projectId: number, steps: Step) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/step`, steps);
  return res.data;
};
export const UpdateStep = async (step: Step) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/step/${step.id}`, step);
  return res.data;
};

export const DeleteStep = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/step/${id}`);
  return res.data;
};
export const SaveStepActionData = async (actions: Array<any>, stepId: number) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/step/${stepId}`, { resource_actions: actions });
  return res.data;
};