import { CreateRunData, Run } from "../Slice/runsSlice";
import axios from "./axios";

export const Runs = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/runs?q=${searchTerm}`);
  return res.data;
};

export const CreateRun = async (data:CreateRunData,callback:(run:Run)=>void) => {
  const source=`${process.env.REACT_APP_BASE_URL}/${data.type}/${data.id}/run/${data.profileId}`
  const newConnection = new EventSource(source);
  const handleMessage = (evt:any) => {
    const eventData = JSON.parse(evt.data);
    console.log(eventData)
    callback(eventData)
 };
  newConnection.addEventListener("message", handleMessage);
  newConnection.onerror=(e)=>{
    newConnection.close()
  }
  return;
};