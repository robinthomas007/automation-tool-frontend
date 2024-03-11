import axios from "./axios";
import { Suite } from './../Slice/suitesSlice'

export const Suites = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/suite?q=${searchTerm}`);
  return res.data;
};

export const CreateSuites = async (projectId: number, suite: Suite) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/suite`, suite);
  return res.data;
};

export const UpdateSuite = async (suite: Suite) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/suite/${suite.id}`, suite);
  return res.data;
};

export const DeleteSuite = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/suite/${id}`);
  return res.data;
};