import { useCallback, useEffect, useState } from "react";
import Run from "./Run";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Input, Collapse } from 'antd';
import RunsRightPanel from "./RunsRightPanel";
import {
  PlayCircleOutlined
} from '@ant-design/icons';
import { createRun, runsSelector, updateRun } from "../../../redux/Slice/runsSlice";

const Runs = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const dispatch = useAppDispatch();
  const { runs, selectedRuns } = useAppSelector(runsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

//   useEffect(() => {
//     // if (selectedProjects)
//     //   dispatch(fetchRuns({ projectId: selectedProjects?.id, searchTerm: '' }));
//   }, [selectedProjects]);



  const items = runs.map((run, index) => (
    <Collapse.Panel
      header={run.result.name}
      key={index}
      extra={<span onClick={(e) => e.stopPropagation()}><PlayCircleOutlined style={{ color: '#873cb7' }}/></span>}
    >
      <Run run={selectedRuns} />
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
