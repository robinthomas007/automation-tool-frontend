import { useCallback, useEffect, useState } from "react";
import Resource from "./Resource";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchResources, resourcesSelector, selectResources, fetchResElCommands, deleteResource, fetchResElEvents, fetchResourceTypes } from "./../../../redux/Slice/resourcesSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Input } from 'antd';
import { Collapse, Row, Col, Button } from 'antd';
import CreateModal from './CreateModal'
import {
  ContainerTwoTone,
  EditTwoTone,
  FolderAddTwoTone,
  FolderTwoTone,
  FileAddTwoTone,
  DeleteTwoTone,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import CreateActionModal from "./CreateActionModal";
import Loader from "../../../Components/Loader";
import { deleteFolder, foldersSelector, selectFolders } from "../../../redux/Slice/foldersSlice";
import CreateFolderModal from "../CreateFolderModal";
import { Hierarchy } from "../../../Lib/helpers";

const Resources = () => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  
  const dispatch = useAppDispatch();
  const { resources:allResources, fetchLoading } = useAppSelector(resourcesSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { folders } = useAppSelector(foldersSelector);
  const [searchText,setSearchText] = useState('')
  const [resources,setResources] = useState<any[]>([])
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)
  const [resourceEdit, setResourceEdit] = useState<any>({})
  const [folderEdit, setFolderEdit] = useState<any>({})
  const [h, setH] = useState<any>([]) 
  const [keys,setKeys]=useState<string[]>([])
  useEffect(() => {
    if (selectedProjects)
      setResources(allResources.filter(a => {
        var tname = a.name
        tname = tname.toLowerCase()
        return tname.includes(searchText.toLowerCase())
      }))
  }, [allResources, searchText])
  useEffect(() => {
        const fs = folders.filter((f:any)=>f.containerType=='Resource')
        const rs = resources
        var na:any = fs.map((f:any) => ({ ...f, resources: [] }))
        for (const s of rs) {
          const f = na.find((f:any) => s.folder && f.id ==  s.folder.id)
          if (f)
            f.resources = [...f.resources, s]
        }
        setH(Hierarchy(na,{resources:rs.filter(s=>!s.folder)}))
  }, [resources, folders])
  useEffect(() => {
    if (selectedProjects){
      dispatch(fetchResElCommands());
      dispatch(fetchResElEvents());
      dispatch(fetchResourceTypes());
      dispatch(fetchResources({ projectId: selectedProjects?.id, searchTerm: '' }));
    }   
  }, [selectedProjects, dispatch]);
  const handleCancel = () => {
    setOpenCreate(false)
    setResourceEdit({})
  }

  const handleOpenEditResource = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, resource: any,folder:any) => {
    e.stopPropagation()
    setOpenCreate(true)
    setResourceEdit({resource,folder})
  }

  const handleOpenEditFolder = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, folder: any,parent:any) => {
    e.stopPropagation()
    setOpenCreateFolder(true)
    setFolderEdit({folder,parent})
  }
  const handleCancelFolder = () => {
    setOpenCreateFolder(false)
  }
  
  return (
    <div className="data-root">
      <Row className="filter">
        <Col span={24} style={{ textAlign: 'right', display: 'flex', flexDirection: 'row' }}>
            <CreateModal resource={resourceEdit} open={openCreate}  handleCancel={handleCancel} />
            <CreateFolderModal data={folderEdit} open={openCreateFolder} handleCancel={handleCancelFolder} containerType="Resource"/>
            <Input type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} />
            <FileAddTwoTone  onClick={(e) => handleOpenEditResource(e,undefined,undefined)} style={{ marginLeft: 10, marginRight: 10 }} />
            <FolderAddTwoTone onClick={(e) => handleOpenEditFolder(e,undefined,undefined)} style={{ marginLeft: 10, marginRight: 10 }} />
        </Col>
      </Row>
      <Row className="data">
        <Col span={24}>
          {fetchLoading && <Loader />}
          {!fetchLoading && <Folder data={h} keys={keys} setKeys={setKeys} index={0}/>}
        </Col>
      </Row>
    </div>
  );
};
const Folder = ({ data,keys,index ,setKeys}: any) => {
  const handleCancel = () => {
    setOpenCreate(false)
  }
  const handleCancelFolder = () => {
    setOpenCreateFolder(false)
  }
  const [openCreateAction, setOpenCreateAction] = useState(false)
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)
  const [resourceEdit, setResourceEdit] = useState<any>({folder:data})
  const [folderEdit, setFolderEdit] = useState<any>({})
  const dispatch = useAppDispatch();

  const handleOpenEditResource = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, resource: any,folder:any) => {
    e.stopPropagation()
    setOpenCreate(true)
    setResourceEdit({resource,folder})
  }

  const handleOpenEditFolder = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, folder: any,parent:any) => {
    e.stopPropagation()
    setOpenCreateFolder(true)
    setFolderEdit({folder,parent})
  }
  const handleDeleteResource = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, resource: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteResource({ id: resource.id }))
  }
  const handleDeleteFolder = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, folder: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteFolder({ id: folder.id }))
  }
  const handleCancelCreateAction = () => {
    setOpenCreateAction(false)
  }
  const onChange = useCallback((k: string | string[]) => {
    const mkey = k[k.length - 1]
    if (mkey) {
      if (keys.length==0){
        setKeys([mkey])
      } else {
        const copy=[...keys]
        copy.splice(index,keys.length,mkey)
        if (copy){
          setKeys(copy)
        } else {
          setKeys([])
        }
      }
      const id = mkey.substring(2)
      if (mkey.startsWith("r-")) {
        const resource=data.resources.find((r:any) => r.id == id)
        dispatch(selectResources(resource))
      } else {
        dispatch(selectFolders(data.children.find((f:any) => f.id == id)))
      }
    }

  },[keys,index,data]);
  return <div>
    <CreateActionModal open={openCreateAction} handleCancel={handleCancelCreateAction}/>
    <CreateModal resource={resourceEdit} open={openCreate} handleCancel={handleCancel} />
    <CreateFolderModal data={folderEdit} open={openCreateFolder} handleCancel={handleCancelFolder} containerType="Resource"/>
    <Collapse accordion onChange={onChange} defaultActiveKey={(keys && keys.length>index)?keys[index]:null}>
    {data.children && data.children.map((f: any) => <Collapse.Panel
      header={<div><FolderTwoTone/><span className="ml-2">{f.name}</span></div>}
      key={`f-${f.id}`}
      className="resource-panel"
      extra={<div className="flex items-center">
        <span className="resource-panel-extra flex">
          <FileAddTwoTone className="edit-icon" onClick={(e) => handleOpenEditResource(e,undefined,f)} style={{ marginLeft: 10, marginRight: 10 }} />
          <FolderAddTwoTone className="edit-icon" onClick={(e) => handleOpenEditFolder(e,undefined,f)} style={{ marginLeft: 10, marginRight: 10 }} />  
          <EditTwoTone className="edit-icon" onClick={(e) => handleOpenEditFolder(e, f,data)} style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone className="delete-icon" onClick={(e) => handleDeleteFolder(e, f)} style={{ marginRight: 15 }} />
        </span>
      </div>}
    >
      <Folder data={f} keys={keys} setKeys={setKeys} index={index+1}/>
    </Collapse.Panel>)}
    {data.resources && data.resources.map((resource:any) => (
      <Collapse.Panel
        header={<div>
          <ContainerTwoTone/><span className="ml-2">{resource.name}</span>
          </div>}
        key={`r-${resource.id}`}
        className="resource-panel"
        extra={<div className="flex items-center">
          <span className="resource-panel-extra flex">
            <EditTwoTone onClick={(e) => handleOpenEditResource(e, resource,data)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
            {resource.type=="PAGE" && <DeleteTwoTone onClick={(e) => handleDeleteResource(e, resource)} className="delete-icon" style={{ marginRight: 15 }} />}
            <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateAction(true)} />
          </span>
        </div>}
      >
        <Resource resource={resource}/>
      </Collapse.Panel>
    ))}
  </Collapse>
  </div>
}
export default Resources;
