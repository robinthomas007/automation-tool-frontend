import {  useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchTests, testsSelector, selectTests, deleteTest, Test as TestModel, updateTest } from "./../../../redux/Slice/testsSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { dataProfileSelector, fetchProfiles } from "./../../../redux/Slice/dataProfileSlice";
import { Row, Col, Collapse, Dropdown, Input, Empty } from 'antd';
import { useDrop, useDrag } from 'react-dnd';

import CreateModal from './CreateModal'
import {
  PlayCircleOutlined,
  SyncOutlined,
  EditTwoTone,
  FolderAddTwoTone,
  FolderTwoTone,
  ExperimentTwoTone,
  FileAddTwoTone,
  FileAddFilled,
  FolderAddFilled,
  DeleteTwoTone
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Loader from "../../../Components/Loader";
import { createRun } from "../../../redux/Slice/runsSlice";
import { meSelector } from "../../../redux/Slice/meSlice";
import Test from "./Test";
import { deleteFolder, foldersSelector, selectFolders } from "../../../redux/Slice/foldersSlice";
import CreateFolderModal from "../CreateFolderModal";
import { Hierarchy } from "../../../Lib/helpers";

const DraggableTest = ({ item, type,children }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });


  return (
    <div ref={drag} style={{ cursor: 'move' }}>
      {children}
    </div>
  );
};
const Tests = () => {
  const dispatch = useAppDispatch();
  const { tests: allTests, fetchLoading } = useAppSelector(testsSelector);
  const { folders } = useAppSelector(foldersSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const [searchText, setSearchText] = useState('')
  const [tests, setTests] = useState<any[]>([])
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)
  const [testEdit, setTestEdit] = useState<any>({})
  const [folderEdit, setFolderEdit] = useState<any>({})
  const [h, setH] = useState<any>([]) 
  const [keys,setKeys]=useState<string[]>([])
  useEffect(() => {
      setTests(allTests.filter(a => {
        var tname = a.name
        tname = tname.toLowerCase()
        return tname.includes(searchText.toLowerCase())
      }))
  }, [allTests, searchText])
  useEffect(() => {
        const fs = folders.filter((f:any)=>f.containerType=='Test')
        const ts = tests
        var na:any = fs.map((f:any) => ({ ...f, tests: [] }))
        for (const t of ts) {
          const f = na.find((f:any) => f.id == t.folder.id)
          if (f)
            f.tests = [...f.tests, t]
        }
        setH(Hierarchy(na,{tests:ts.filter(t=>t.folder.id==0)}))
  }, [tests, folders])

  useEffect(() => {
    if (selectedProjects) {
      dispatch(fetchTests({ projectId: selectedProjects?.id, searchTerm: '' }));
      dispatch(fetchProfiles({ projectId: selectedProjects?.id || 0, searchTerm: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects,folders]);
  const handleOpenEditTest = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, test: any,folder:any) => {
    e.stopPropagation()
    setOpenCreate(true)
    setTestEdit({test,folder})
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
            <CreateModal test={testEdit} open={openCreate}  handleCancel={handleCancel} />
            <CreateFolderModal data={folderEdit} open={openCreateFolder} handleCancel={handleCancelFolder} containerType="Test"/>
            <Input type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e) => { setSearchText(e.target.value) }} />
            <FileAddTwoTone  onClick={(e) => handleOpenEditTest(e,undefined,undefined)} style={{ marginLeft: 10, marginRight: 10 }} />
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
  const [, drop] = useDrop({
    accept: 'TEST_TO_FOLDER',
    drop: (item:any,monitor) => {
      if(monitor.didDrop()){
        return
      } else {
        const new_test:any = {name:item.name,description:item.description,lock:item.lock,folder_id:data.id,id:item.id}
        dispatch(updateTest({test:new_test}))
      }
    }
  });

  const { fetchLoading } = useAppSelector(testsSelector);
  const { selectedOrgs } = useAppSelector(meSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { profle } = useAppSelector(dataProfileSelector);
  const navigate = useNavigate();
  const handleCancel = () => {
    setOpenCreate(false)
  }
  const handleCancelFolder = () => {
    setOpenCreateFolder(false)
  }
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false)
  const [testEdit, setTestEdit] = useState<any>({folder:data})
  const [folderEdit, setFolderEdit] = useState<any>({})
  const dispatch = useAppDispatch();
  const StartExecution = (id: number, profileId: number, browser: string, headless: boolean) => {
    dispatch(createRun({
      projectId: selectedProjects!!.id, body: {
        test_id: id,
        profile_id: profileId,
        browser: browser,
        headless: headless
      }
    }))
    navigate(`/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/runs`)
  }

  const browsers = ["chrome", "chrome-beta", "chrome-dev", "chrome-canary"]


  const generateMenuItems = (suit: any) => {
    return profle.map((prf) => ({
      key: prf.id.toString(),
      label: (
        <span >
          Start Execution for {prf.name}
        </span>
      ),
      children: browsers.flatMap(b => {
        return [{
          key: b,
          label: (<span onClick={(e) => {
            StartExecution(suit.id, prf.id, b, false)
            e.stopPropagation();
          }}>{b}</span>)
        },
        {
          key: b + "-headless",
          label: (<span onClick={(e) => {
            StartExecution(suit.id, prf.id, b, true)
            e.stopPropagation();
          }}>{b}-headless</span>)
        }
        ]
      })
    }));
  };
  const handleOpenEditTest = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, test: any,folder:any) => {
    e.stopPropagation()
    setOpenCreate(true)
    setTestEdit({test,folder})
  }

  const handleOpenEditFolder = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, folder: any,parent:any) => {
    e.stopPropagation()
    setOpenCreateFolder(true)
    setFolderEdit({folder,parent})
  }
  const handleDeleteTest = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, test: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteTest({ id: test.id }))
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
      if (mkey.startsWith("t-")) {
        const test=data.tests.find((t:any) => t.id == id)
        dispatch(selectTests(test))
      } else {
        dispatch(selectFolders(data.children.find((f:any) => f.id == id)))
      }
    }

  },[keys,index,data]);
  return <div ref={drop}>
    <CreateModal test={testEdit} open={openCreate} handleCancel={handleCancel} />
    <CreateFolderModal data={folderEdit} open={openCreateFolder} handleCancel={handleCancelFolder} containerType="Test"/>
    {(data.children && data.children.length>0)||(data.tests && data.tests.length>0)?<Collapse ref={drop} onChange={onChange} defaultActiveKey={(keys && keys.length>index)?keys[index]:null}>
    {data.children && data.children.map((f: any) => <Collapse.Panel
      header={<div><FolderTwoTone/><span className="ml-2">{f.name}</span></div>}
      key={`f-${f.id}`}
      className="resource-panel"
      extra={<div className="flex items-center">
        <span className="resource-panel-extra flex">
          <FileAddTwoTone className="edit-icon" onClick={(e) => handleOpenEditTest(e,undefined,f)} style={{ marginLeft: 10, marginRight: 10 }} />
          <FolderAddTwoTone className="edit-icon" onClick={(e) => handleOpenEditFolder(e,undefined,f)} style={{ marginLeft: 10, marginRight: 10 }} />  
          <EditTwoTone className="edit-icon" onClick={(e) => handleOpenEditFolder(e, f,data)} style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone className="delete-icon" onClick={(e) => handleDeleteFolder(e, f)} style={{ marginRight: 15 }} />
        </span>
      </div>}
    >
      <Folder data={f} keys={keys} setKeys={setKeys} index={index+1}/>
    </Collapse.Panel>)}
    {data.tests && data.tests.map((test:any) => (
      <Collapse.Panel
        header={<DraggableTest item={test} type="TEST_TO_FOLDER"><div><ExperimentTwoTone/><span className="ml-2">{test.name}{test.lock !== "" ? ` (lock: ${test.lock})` : ""}</span></div></DraggableTest>}
        key={`t-${test.id}`}
        className="resource-panel"
        extra={<div className="flex items-center">
          <span className="resource-panel-extra flex">
            
            <EditTwoTone onClick={(e) => handleOpenEditTest(e, test,data)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
            <DeleteTwoTone onClick={(e) => handleDeleteTest(e, test)} className="delete-icon" style={{ marginRight: 15 }} />
          </span>
          <Dropdown menu={{ items: generateMenuItems(test) }} placement="bottom" arrow={{ pointAtCenter: true }}>
            <span onClick={(e) => e.stopPropagation()}>
              {fetchLoading ? <SyncOutlined spin style={{ color: '#873cb7' }} /> : <PlayCircleOutlined style={{ color: '#873cb7' }} />}
            </span>
          </Dropdown>
        </div>}
      >
        <Test test={test}/>
      </Collapse.Panel>
    ))}
  </Collapse>:<Empty/>}
  </div>
}


export default Tests;
