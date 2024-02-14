import { Project } from "../Slice/projectsSlice";
import { Test } from './../Slice/testsSlice'
import { Step } from './../Slice/stepsSlice'

import axios from "./axios";
export const Tests = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/test?q=${searchTerm}`);
  return res.data;
};

export const CreateTest = async (projectId: number, test: Test) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/test`, test);
  return res.data;
};

export const SaveTestStepData = async (steps: Array<Step>, testId: number) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/test/${testId}`, { steps: steps });
  return res.data;
};