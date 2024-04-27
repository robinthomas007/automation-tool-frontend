import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchSteps, stepsSelector, selectSteps, deleteStep, selectResourceAction } from "./../../../redux/Slice/stepsSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Input, Button, Collapse, Empty, Dropdown } from 'antd';
import Step from './Step'
import CreateModal from './CreateModal'
import {
  StepForwardFilled,
  EditTwoTone,
  FolderAddTwoTone,
  FolderTwoTone,
  FileAddTwoTone,
  DeleteTwoTone
} from '@ant-design/icons';
import Loader from "../../../Components/Loader";
import { deleteFolder, foldersSelector, selectFolders } from "../../../redux/Slice/foldersSlice";
import CreateFolderModal from "../CreateFolderModal";
import { Hierarchy } from "../../../Lib/helpers";
import { fetchProfiles } from "../../../redux/Slice/dataProfileSlice";

const Steps = () => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const dispatch = useAppDispatch();
  const { steps:allSteps, fetchLoading } = useAppSelector(stepsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  const [searchText,setSearchText] = useState('')
  const { folders } = useAppSelector(foldersSelector);
  const [steps,setSteps] = useState<any[]>([])
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)
  const [stepEdit, setStepEdit] = useState<any>({})
  const [folderEdit, setFolderEdit] = useState<any>({})
  const [h, setH] = useState<any>([]) 
  const [keys,setKeys]=useState<string[]>([])
  useEffect(() => {
    if (selectedProjects)
      setSteps(allSteps.filter(a => {
        var tname = a.name
        tname = tname.toLowerCase()
        return tname.includes(searchText.toLowerCase())
      }))
  }, [allSteps, searchText])
  useEffect(() => {
        const fs = folders.filter((f:any)=>f.containerType=='Step')
        const ss = steps
        var na:any = fs.map((f:any) => ({ ...f, steps: [] }))
        for (const s of ss) {
          const f = na.find((f:any) => s.folder && f.id ==  s.folder.id)
          if (f)
            f.steps = [...f.steps, s]
        }
        setH(Hierarchy(na,{steps:ss.filter(s=>!s.folder)}))
  }, [steps, folders])

  useEffect(() => {
    if (selectedProjects) {
      dispatch(fetchSteps({ projectId: selectedProjects?.id, searchTerm: '' }));
      dispatch(fetchProfiles({ projectId: selectedProjects?.id || 0, searchTerm: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects,folders]);
  const handleOpenEditStep = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, step: any,folder:any) => {
    e.stopPropagation()
    setOpenCreate(true)
    setStepEdit({step,folder})
  }

  const handleOpenEditFolder = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, folder: any,parent:any) => {
    e.stopPropagation()
    setOpenCreateFolder(true)
    setFolderEdit({folder,parent})
  }

  const handleCancel = () => {
    setOpenCreate(false)
  }
  const handleCancelFolder = () => {
    setOpenCreateFolder(false)
  }

  return (
    <div className="data-root">
      <Row className="filter">
        <Col span={24} style={{ textAlign: 'right', display: 'flex', flexDirection: 'row' }}>
            <CreateModal step={stepEdit} open={openCreate}  handleCancel={handleCancel} />
            <CreateFolderModal data={folderEdit} open={openCreateFolder} handleCancel={handleCancelFolder} containerType="Step"/>
            <Input type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} />
            <FileAddTwoTone  onClick={(e) => handleOpenEditStep(e,undefined,undefined)} style={{ marginLeft: 10, marginRight: 10 }} />
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
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)
  const [stepEdit, setStepEdit] = useState<any>({folder:data})
  const [folderEdit, setFolderEdit] = useState<any>({})
  const dispatch = useAppDispatch();

  const handleOpenEditStep = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, step: any,folder:any) => {
    e.stopPropagation()
    setOpenCreate(true)
    setStepEdit({step,folder})
  }

  const handleOpenEditFolder = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, folder: any,parent:any) => {
    e.stopPropagation()
    setOpenCreateFolder(true)
    setFolderEdit({folder,parent})
  }
  const handleDeleteStep = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, test: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteStep({ id: test.id }))
  }
  const handleDeleteFolder = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, folder: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteFolder({ id: folder.id }))
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
      if (mkey.startsWith("s-")) {
        const step=data.steps.find((s:any) => s.id == id)
        dispatch(selectSteps(step))
      } else {
        dispatch(selectFolders(data.children.find((f:any) => f.id == id)))
      }
    }

  },[keys,index,data]);
  return <div>
    <CreateModal step={stepEdit} open={openCreate} handleCancel={handleCancel} />
    <CreateFolderModal data={folderEdit} open={openCreateFolder} handleCancel={handleCancelFolder} containerType="Step"/>
    <Collapse accordion onChange={onChange} defaultActiveKey={(keys && keys.length>index)?keys[index]:null}>
    
    {data.children && data.children.map((f: any) => <Collapse.Panel
      header={<div><FolderTwoTone/><span className="ml-2">{f.name}</span></div>}
      key={`f-${f.id}`}
      className="resource-panel"
      extra={<div className="flex items-center">
        <span className="resource-panel-extra flex">
          <FileAddTwoTone className="edit-icon" onClick={(e) => handleOpenEditStep(e,undefined,f)} style={{ marginLeft: 10, marginRight: 10 }} />
          <FolderAddTwoTone className="edit-icon" onClick={(e) => handleOpenEditFolder(e,undefined,f)} style={{ marginLeft: 10, marginRight: 10 }} />  
          <EditTwoTone className="edit-icon" onClick={(e) => handleOpenEditFolder(e, f,data)} style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone className="delete-icon" onClick={(e) => handleDeleteFolder(e, f)} style={{ marginRight: 15 }} />
        </span>
      </div>}
    >
      <Folder data={f} keys={keys} setKeys={setKeys} index={index+1}/>
    </Collapse.Panel>)}
    {data.steps && data.steps.map((step:any) => (
      <Collapse.Panel
        header={<div><StepForwardFilled/><span className="ml-2">{step.name}</span></div>}
        key={`s-${step.id}`}
        className="resource-panel"
        extra={<div className="flex items-center">
          <span className="resource-panel-extra flex">
            <EditTwoTone onClick={(e) => handleOpenEditStep(e, step,data)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
            <DeleteTwoTone onClick={(e) => handleDeleteStep(e, step)} className="delete-icon" style={{ marginRight: 15 }} />
          </span>
        </div>}
      >
        <Step step={step}/>
      </Collapse.Panel>
    ))}
  </Collapse>
  </div>
}

export default Steps;
