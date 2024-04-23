import axios from "./axios";

export const DataProfile = async (projectId: number, searchTerm?: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/profile?q=${searchTerm}`);
  return res.data;
};
export const DeleteProfile = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/profile/${id}`);
  return res.data;
};
export const DeleteVariable = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/variable/${id}`);
  return res.data;
};

export const DataProfileVariables = async (projectId: number, searchTerm?: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/variable?q=${searchTerm}`);
  return res.data;
};

export const CreateProfile = async (data: object, projectId: number) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/profile`, data);
    return res.data;
  } catch (error) {
    console.error('Error in CreateProfile:', error);
    throw error;
  }
};

export const CreateVariable = async (data: object, projectId: any) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/variable`, data);
    return res.data;
  } catch (error) {
    console.error('Error in Createvariable:', error);
    throw error;
  }
};

export const CreateProfileVariable = async (variables: object, profileId: number) => {
  try {
    const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/profile/${profileId}`, variables);
    return res.data;
  } catch (error) {
    console.error('Error in Createvariable:', error);
    throw error;
  }
};