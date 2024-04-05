import axios from "./axios";
import { Resource, ResourceActionPayload, ResourceElementPayload } from './../Slice/resourcesSlice'

export const Resources = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/resource?q=${searchTerm}`);
  return res.data;
};

export const CreateResources = async (projectId: number, resource: Resource) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/resource`, resource);
  return res.data;
};

export const UpdateResource = async (resource: ResourceActionPayload, resourceId: number) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/resource/${resourceId}`, resource);
  return res.data;
};

export const DeleteResource = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/resource/${id}`);
  return res.data;
};

export const GetElementsByAction = async (id: String) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/action/${id}`);
  return res.data;
};

export const SaveElementsInAction = async (id: String, data: any) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/action/${id}`, data);
  return res.data;
};

export const CreateResourcesAction = async (resourceId: number, resourceAction: ResourceActionPayload) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/resource/${resourceId}/action`, resourceAction);
  return res.data;
};

export const UpdateResourcesAction = async (resourceAction: ResourceActionPayload, resourceId: number, actionId: number) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/action/${actionId}`, resourceAction);
  return res.data;
};

export const DeleteAction = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/action/${id}`);
  return res.data;
};

export const CreateResourcesElements = async (resourceId: number, resourceElement: ResourceElementPayload) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/resource/${resourceId}/element`, resourceElement);
  return res.data;
};

export const UpdateResourcesElements = async (element: ResourceElementPayload) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/element/${element.id}`, element);
  return res.data;
};

export const DeleteElement = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/element/${id}`);
  return res.data;
};

export const FetchResElCommands = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/command`);
  return res.data;
};
export const FetchResElEvents = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/event`);
  return res.data;
};
export const FetchResourceTypes = async () => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/resource/types`);
  return res.data;
};