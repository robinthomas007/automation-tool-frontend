import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchSteps, stepsSelector, selectSteps } from "./../../../redux/Slice/stepsSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Input, Button, Collapse } from 'antd';
import StepResourceActions from './StepResourceActions'
import CreateModal from './CreateModal'
import StepsRightPanel from './StepsRightPanel'

const Steps = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const dispatch = useAppDispatch();
  const { steps, selectedSteps } = useAppSelector(stepsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  const items = steps.map((step, index) => ({ ...step, label: step.name, key: index, children: <StepResourceActions step={selectedSteps} /> }));

  const onChange = (key: string | string[]) => {
    if (key.length)
      dispatch(selectSteps(steps[Number(key)]))
  };

  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchSteps({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects]);

  const handleCancel = () => {
    setOpenCreate(false)
  }

  const stepItems = steps.map((step, index) => (
    <Collapse.Panel
      header={step.name}
      key={index}
    >
      <StepResourceActions step={step} />
    </Collapse.Panel>
  ));

  return (
    showSelected ? <div>
      <Row>
        <Col span={12}>
          <Input placeholder="Search Steps" />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Steps</Button>
          <CreateModal open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse onChange={onChange} accordion destroyInactivePanel={true} style={{ marginTop: 10 }} >
            {stepItems}
          </Collapse>
        </Col>
      </Row>
    </div> : <div>
      <StepsRightPanel />
    </div>
  );
};

export default Steps;
