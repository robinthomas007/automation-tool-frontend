import { useCallback, useEffect, useState } from "react";
import Suite from "./Suite";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchSuites, suitesSelector, selectSuites } from "./../../../redux/Slice/suitesSlice";
import { TextInput } from "flowbite-react";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Input, Button, Collapse } from 'antd';
import CreateModal from './CreateModal'
import SuiteRightPanel from "./SuiteRightPanel";
import {
  PlayCircleOutlined
} from '@ant-design/icons';
import { createRun, updateRun } from "../../../redux/Slice/runsSlice";

const Suites = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const dispatch = useAppDispatch();
  const { suites, selectedSuites } = useAppSelector(suitesSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchSuites({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects]);

  const handleCancel = () => {
    setOpenCreate(false)
  }
  const StartExecution=useCallback((id:number,profileId:number)=>{
    dispatch(createRun({data:{
      id:id,
      profileId: profileId,
      type:"suite"
    },callback:(data)=>{
      dispatch(updateRun(data))
    }}))
  },[])

  const onChange = (key: string | string[]) => {
    const index = key[key.length - 1]
    index && dispatch(selectSuites(suites[Number(index)]))
  };

  const items = suites.map((suit, index) => (
    <Collapse.Panel
      header={suit.name}
      key={index}
      extra={<span onClick={(e) => e.stopPropagation()}><PlayCircleOutlined style={{ color: '#873cb7' }} onClick={(e)=>{
        StartExecution(suit.id,1)
      }}/></span>}
    >
      <Suite suite={selectedSuites} />
    </Collapse.Panel>
  ));

  return (
    showSelected ? <div>
      <Row>
        <Col span={12}>
          <Input placeholder="Search Suite" />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Suite </Button>
          <CreateModal open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse onChange={onChange} accordion style={{ marginTop: 10 }}>
            {items}
          </Collapse>
        </Col>
      </Row>
    </div> : <SuiteRightPanel />
  );
};

export default Suites;
