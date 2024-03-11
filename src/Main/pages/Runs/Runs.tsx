import { useCallback, useEffect, useState } from "react";
import Run from "./Run";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { Row, Col, Input, Collapse } from 'antd';
import RunsRightPanel from "./RunsRightPanel";
import {
  PlayCircleOutlined
} from '@ant-design/icons';
import {  runsSelector } from "../../../redux/Slice/runsSlice";

export function ToDuration(time:number):string {
  return ""
}
const Runs = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const { runs, selectedRunId } = useAppSelector(runsSelector);
  const items = runs.map((run, index) => (
    <Collapse.Panel
      header={`${run.result.name} (${run.result.time})`}
      key={index}
      extra={<span onClick={(e) => e.stopPropagation()}><PlayCircleOutlined style={{ color: '#873cb7' }} /></span>}
    >
      {selectedRunId && <Run run={runs.find(r => r.id == selectedRunId)!} />}
    </Collapse.Panel>
  ));
  return (
    showSelected ? <div>
      <Row>
        <Col span={12}>
          <Input placeholder="Search Run" />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse accordion style={{ marginTop: 10 }}>
            {items}
          </Collapse>
        </Col>
      </Row>
    </div> : <RunsRightPanel />
  );
};
export default Runs;
