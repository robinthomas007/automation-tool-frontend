import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAppDispatch } from "./../redux/hooks";
import { updateRun } from "./../redux/Slice/runsSlice";
import { Run } from './../redux/Slice/runsSlice'
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { getCookie } from '../Lib/auth';
interface EventSourceContextType {
  runs: Run | null
  setRuns: any
}

interface EventSourceProviderProps {
  children: React.ReactNode;
}

const EventSourceContext = createContext<EventSourceContextType | any>(null)

export const EventSourceProvider = ({ children }: EventSourceProviderProps) => {
  const [socket, setSocket] = useState<Run | null>(null);
  const dispatch = useAppDispatch();

  const getRuns = async (projectId:number,data: any) => {
    const source = `${process.env.REACT_APP_BASE_URL}/project/${projectId}/run`
    console.log("Called")
    await fetchEventSource(source, {
      method:"POST",
      headers:{
        "Authorization":"Bearer "+getCookie('token')
      },
      body: JSON.stringify(data),
      onmessage(event) {
        const eventData = JSON.parse(event.data);
        setSocket(eventData)
      }
  });
    // const eventSource = new EventSource(source);

    // eventSource.onerror = (e) => {
    //   eventSource.close()
    // }

    // eventSource.onmessage = (event) => {
    //   const eventData = JSON.parse(event.data);
    //   setSocket(eventData)
    // }

  }

  useEffect(() => {
    if (socket) {
      dispatch(updateRun(socket))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket])

  return (
    <EventSourceContext.Provider
      value={{ socket, getRuns }}
    >
      {children}
    </EventSourceContext.Provider>
  )
}

export const useEventSource = () => {
  return useContext(EventSourceContext)
}
