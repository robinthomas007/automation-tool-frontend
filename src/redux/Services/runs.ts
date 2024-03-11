import { CreateRunData, Run } from "../Slice/runsSlice";
import axios from "./axios";

export const Runs = async (projectId: number, searchTerm: string) => {
  const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/project/${projectId}/run?q=${searchTerm}`);
  return res.data;
};
export var eventSource: EventSource | undefined = undefined
// export const CreateRun = async (projectId:number,data: CreateRunData, callback: (run: Run) => void) => {
//   const source = `${process.env.REACT_APP_BASE_URL}/project/${projectId}/run`
//   const handleMessage = (evt: any) => {
//     const eventData = JSON.parse(evt.data);
//     console.log(eventData)
//     callback(eventData)
//   }
//   const eventSource = new EventSource(source);
//   eventSource.addEventListener("message", handleMessage);
//   eventSource.onerror = (e) => {
//     eventSource.close()
//   }
//   return;
// };