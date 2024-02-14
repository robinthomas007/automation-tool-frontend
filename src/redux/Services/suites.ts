import axios from "./axios";
import { Suite } from './../Slice/suitesSlice'

export const Suites = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/suite?q=${searchTerm}`);
  return res.data;
};


export const CreateSuites = async (projectId: number,suite: Suite) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/suite`, suite);
  return res.data;
};