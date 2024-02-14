import { useEffect, useState } from "react";
import Resource from "./Resource";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchResources, resourcesSelector, selectResources, fetchResElCommands } from "./../../../redux/Slice/resourcesSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Input } from 'antd';
import { Collapse, Row, Col, Button } from 'antd';
import CreateModal from './CreateModal'
import ResourceRightPanel from './ResourceRightPanel'
import {
  PlusCircleTwoTone,
} from '@ant-design/icons';
import CreateActionModal from "./CreateActionModal";
const Resources = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openCreateAction, setOpenCreateAction] = useState(false)

  const dispatch = useAppDispatch();
  const { resources, selectedResources } = useAppSelector(resourcesSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchResources({ projectId: selectedProjects?.id, searchTerm: '' }));
    dispatch(fetchResElCommands());
  }, [selectedProjects]);


  const onChange = (key: string | string[]) => {
    if (key.length)
      dispatch(selectResources(resources[Number(key)]))
  };

  const handleCancel = () => {
    setOpenCreate(false)
  }
  const handleCancelCreateAction = () => {
    setOpenCreateAction(false)
  }


  const resource = resources.map((resource, index) => (
    <Collapse.Panel
      header={resource.name}
      key={index}
      extra={<span onClick={(e) => e.stopPropagation()}>
        <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateAction(true)} />
      </span>}
    >
      <Resource resource={resource} />
    </Collapse.Panel>
  ));

  return (
    showSelected ? <div>
      <Row>
        <Col span={12}>
          <Input placeholder="Search Resource" />
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Resource</Button>
          <CreateModal open={openCreate} handleCancel={handleCancel} />
          <CreateActionModal open={openCreateAction} handleCancel={handleCancelCreateAction} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse onChange={onChange} accordion destroyInactivePanel={true} style={{ marginTop: 10 }} >
            {resource}
          </Collapse>
        </Col>
      </Row>
    </div> : <div>
      {selectedResources && <ResourceRightPanel resource={selectedResources} />}
    </div>
  );
};

export default Resources;
