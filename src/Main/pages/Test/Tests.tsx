import { useEffect, useState } from "react";
import Test from "./Test";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchTests, testsSelector, selectTests } from "./../../../redux/Slice/testsSlice";
import { TextInput } from "flowbite-react";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Input, Button, Collapse } from 'antd';
import CreateModal from './CreateModal'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import TestRightPanel from './TestRightPanel'
import {
  PlayCircleOutlined
} from '@ant-design/icons';


const Tests = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const dispatch = useAppDispatch();
  const { tests } = useAppSelector(testsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchTests({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects]);

  const handleCancel = () => {
    setOpenCreate(false)
  }

  const onChange = (key: string | string[]) => {
    const index = key[key.length - 1]
    dispatch(selectTests(tests[Number(index)]))
  };

  return (
    <div>
      <Row>
        <Col span={12}>
          <Input placeholder="Search Test" />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Tests </Button>
          <CreateModal open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {showSelected && <Collapse onChange={onChange} style={{ marginTop: 10 }}>
            {tests.map((test, index) => (
              <Collapse.Panel
                header={test.name}
                key={index}
                extra={<span onClick={(e) => e.stopPropagation()}><PlayCircleOutlined style={{ color: '#873cb7' }} /></span>}
              >
                <Test test={test} />
              </Collapse.Panel>
            ))}
          </Collapse>}

          {!showSelected && <TestRightPanel />}
        </Col>
      </Row>
    </div>
  );
};

export default Tests;
