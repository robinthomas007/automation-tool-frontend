import { useEffect, useState } from "react";
import Resource from "./Resource";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchResources, resourcesSelector, selectResources, fetchResElCommands, deleteResource, fetchResElEvents, fetchResourceTypes } from "./../../../redux/Slice/resourcesSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Empty, Input } from 'antd';
import { Collapse, Row, Col, Button } from 'antd';
import CreateModal from './CreateModal'
import ResourceRightPanel from './ResourceRightPanel'
import {
  PlusCircleTwoTone,
  EditTwoTone,
  DeleteTwoTone
} from '@ant-design/icons';
import CreateActionModal from "./CreateActionModal";
import Loader from "../../../Components/Loader";

const Resources = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openCreateAction, setOpenCreateAction] = useState(false)
  const [resourceEdit, setResourceEdit] = useState({})
  
  const dispatch = useAppDispatch();
  const { resources:allResources, selectedResources, fetchLoading } = useAppSelector(resourcesSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const [searchText,setSearchText] = useState('')
  const [resources,setResources] = useState<any[]>([])
  useEffect(()=>{
    if (selectedProjects)
      setResources(allResources.filter(a=>{
      var tname=a.name
      tname = tname.toLowerCase()
      return tname.includes(searchText.toLowerCase())
    }))
  },[allResources,searchText])
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchResources({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects, dispatch]);

  useEffect(() => {
    dispatch(fetchResElCommands());
    dispatch(fetchResElEvents());
    dispatch(fetchResourceTypes());
  }, [selectedProjects, dispatch])

  const onChange = (key: string | string[]) => {
    if (key.length)
      dispatch(selectResources(resources[Number(key)]))
  };

  const handleCancel = () => {
    setOpenCreate(false)
    setResourceEdit({})
  }
  const handleCancelCreateAction = () => {
    setOpenCreateAction(false)
  }

  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, resource: any) => {
    e.stopPropagation()
    setOpenCreate(true)
    setResourceEdit(resource)
  }

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, resource: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");

    isConfirmed && dispatch(deleteResource({ id: resource.id }))
  }

  const resource = resources.map((resource, index) => (
    <Collapse.Panel
      header={resource.name}
      key={index}
      extra={resource.type=='PAGE'?<span className="resource-panel-extra">
          <EditTwoTone onClick={(e) => handleOpenEdit(e, resource)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone onClick={(e) => handleDelete(e, resource)} className="delete-icon" />
        </span>:<></>}
      className={selectedResources.id === resource.id ? 'active-panel resource-panel' : 'resource-panel'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0, color: '#1577ff' }}>Interactions</h4>
        <span onClick={(e) => e.stopPropagation()}>
          <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateAction(true)} />
        </span>
      </div>
      <Resource resource={resource} />
    </Collapse.Panel>
  ));


  return (
    <div>
      <Row>
        {/* <Col span={12}>
          <Input placeholder="Search Resource" onChange={handleChangeResource} />
        </Col> */}
        <Col span={24} style={{ textAlign: 'right' , display:'flex', flexDirection:'row'}}>
          <Input type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}/>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Object</Button>
          {openCreate && <CreateModal open={openCreate} handleCancel={handleCancel} resource={resourceEdit} />}
          {openCreateAction && <CreateActionModal open={openCreateAction} handleCancel={handleCancelCreateAction} />}
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {fetchLoading && <Loader />}
          {resources.length > 0 &&
            <Collapse defaultActiveKey={[0]} onChange={onChange} accordion destroyInactivePanel={true} style={{ marginTop: 10 }} >
              {resource}
            </Collapse>}
          {resources.length === 0 && !fetchLoading && <div className="my-40">
            <Empty />
          </div>}
          {/* {resources.length === 0 && <Loader />} */}
          {/* <Collapse defaultActiveKey={[0]} onChange={onChange} accordion destroyInactivePanel={true} style={{ marginTop: 10 }} >
            {resource}
          </Collapse> */}
        </Col>
      </Row>
    </div>
  );
};

export default Resources;
