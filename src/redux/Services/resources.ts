import axios from "./axios";
import { Resource, ResourceActionPayload, ResourceElementPayload } from './../Slice/resourcesSlice'

export const Resources = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/resource?q=${searchTerm}`);
  return res.data;
};

export const CreateResources = async (projectId:number,resource: Resource) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/resource`, resource);
  return res.data;
};

export const GetElementsByAction = async (id: String) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/resource-action/${id}/element-action`);
  return res.data;
};

export const CreateResourcesAction = async (resourceId:number,resourceAction: ResourceActionPayload) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/resource/${resourceId}/action`, resourceAction);
  return res.data;
};

export const CreateResourcesElements = async (resourceId:number,resourceElement: ResourceElementPayload) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/resource/${resourceId}/element`, resourceElement);
  return res.data;
};

export const FetchResElCommands = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/command`);
  return res.data;
};