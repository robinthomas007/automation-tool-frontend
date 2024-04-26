import { Folder } from '../Slice/foldersSlice'

import axios from "./axios";
export const Folders = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/folder?q=${searchTerm}`);
  return res.data;
};

export const CreateFolder = async (projectId: number, folder: Folder) => {
  const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/folder`, folder);
  return res.data;
};



export const UpdateFolder = async (folder: Folder) => {
  const res = await axios.patch(`${process.env.REACT_APP_BASE_URL}/folder/${folder.id}`, folder);
  return res.data;
};

export const DeleteFolder = async (id: number) => {
  const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/folder/${id}`);
  return res.data;
};