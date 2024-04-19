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
  const [ abortController, setAbortController ] = useState(new AbortController());
  const getRuns = async (runId:number) => {
    const { signal } = abortController
    const source = `${process.env.REACT_APP_BASE_URL}/run/${runId}/subscribe`
    await fetchEventSource(source, {
      method:"GET",
      headers:{
        "Authorization":"Bearer "+getCookie('token')
      },
      onmessage(event) {
        const eventData = JSON.parse(event.data);
        setSocket(eventData)
      },
      onclose() {
        abortController.abort() // hack to close the connection
        setAbortController(new AbortController());
      },
      onerror() {
        abortController.abort()
        setAbortController(new AbortController());
      },
      signal
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
