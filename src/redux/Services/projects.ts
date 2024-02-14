import axios from "./axios";
export const Projects = async (orgId:number,searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/org/${orgId}/project?q=${searchTerm}`);
  return res.data;
};


export const CreateProject = async (orgId:number,data: object) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/org/${orgId}/project`, data);
    return res.data;
  } catch (error) {
    console.error('Error in CreateProject:', error);
    throw error;
  }
};