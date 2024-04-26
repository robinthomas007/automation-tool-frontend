import Run from "./Run";
import { useAppSelector } from "./../../../redux/hooks";
import { Row, Col, Empty } from 'antd';

import { runsSelector } from "../../../redux/Slice/runsSlice";
import Loader from "../../../Components/Loader";
import { useEffect } from "react";
import { useEventSource } from "../../../Context/EventSourceContext";

const Runs = () => {
  const { runs, selectedRunId, fetchLoading,lastRun } = useAppSelector(runsSelector);
  const {getRuns} = useEventSource()
  useEffect(()=>{
    if (lastRun!=undefined){
      getRuns(lastRun.id)
    }
  },[lastRun])
  return (
    <div className="data-root">

          {fetchLoading && <Loader />}
          {runs.length === 0 && !fetchLoading && <div className="my-40">
            <Empty />
          </div>}
          {runs.length > 0 && runs.find(r => r.id === selectedRunId) && <Run run={runs.find(r => r.id === selectedRunId)!} />}

    </div>
  );
};
export default Runs;
