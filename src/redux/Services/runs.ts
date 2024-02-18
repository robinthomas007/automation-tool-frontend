import { CreateRunData, Run } from "../Slice/runsSlice";
import axios from "./axios";

export const Runs = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/runs?q=${searchTerm}`);
  return res.data;
};
export var eventSource:EventSource|undefined=undefined
export const CreateRun = async (data:CreateRunData,callback:(run:Run)=>void) => {
  const source=`${process.env.REACT_APP_BASE_URL}/${data.type}/${data.id}/run/${data.profileId}`
  const handleMessage=(evt:any)=>{
    const eventData = JSON.parse(evt.data);
    console.log(eventData)
      callback(eventData)
    }
  const eventSource = new EventSource(source);
  eventSource.addEventListener("message", handleMessage);
  eventSource.onerror=(e)=>{
    eventSource.close()
  }
  return;
};