import { useCallback, useEffect, useState } from "react";
import Run from "./Run";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { Row, Col, Input, Collapse, Empty } from 'antd';
import RunsRightPanel from "./RunsRightPanel";
import {
  PlayCircleOutlined
} from '@ant-design/icons';
import { runsSelector } from "../../../redux/Slice/runsSlice";
import Loader from "../../../Components/Loader";

const Runs = () => {
  const { runs, selectedRunId, fetchLoading } = useAppSelector(runsSelector);

  return (
    <div>
      <Row>
        <Col span={24}>
          {fetchLoading && <Loader />}
          {runs.length === 0 && !fetchLoading && <div className="my-40">
            <Empty />
          </div>}
          {runs.length > 0 && <Run run={runs.find(r => r.id === selectedRunId)!} />}
        </Col>
      </Row>
    </div>
  );
};
export default Runs;
