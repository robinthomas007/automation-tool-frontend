import axios from "./axios";
export const GetMe = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/me`);
  return res.data;
};
export const GetAPIKeys = async (projectId:number) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/apiKey`);
  return res.data;
};
export const GenerateAPIKey = async (projectId:number) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/apiKey`);
  return res.data;
};
export const GetOrgUsers = async (org_id:number) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/org/${org_id}/user`);
  return res.data;
};
export const UpsertOrgUser = async (org_id:number,data:UserRole) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/org/${org_id}/user`,data);
  return res.data;
};
export const GetProjectUsers = async (project_id:number) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${project_id}/user`);
  return res.data;
};
export const UpsertProjectUser = async (project_id:number,data:UserRole) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${project_id}/user`,data);
  return res.data;
};
export type UserRole = {
  email:string,
  role:string
}
