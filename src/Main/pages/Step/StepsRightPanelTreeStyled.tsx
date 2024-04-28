
import React, { useCallback, useEffect, useState } from 'react'
import { Row, Col, Input, Tree } from 'antd';
import {  DeleteTwoTone, EditTwoTone,  ContainerTwoTone,
  InteractionTwoTone,
} from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Resource, deleteAction, fetchResources, resourcesSelector } from "../../../redux/Slice/resourcesSlice";
import { projectsSelector } from "../../../redux/Slice/projectsSlice";
import { Hierarchy } from '../../../Lib/helpers';
import { foldersSelector } from '../../../redux/Slice/foldersSlice';
import CreateActionModal from '../Resource/CreateActionModal';
import { SanitizeTreeData } from '../../../Lib/helperComponents';
const {DirectoryTree} = Tree
const DraggableItem = ({ item, type, handleOpenEdit, handleDelete }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });

  return (
    <span style={{ padding: 15, width: '100%' }}>
        <span ref={drag} style={{ cursor: 'move', width: '100%' }}>{item.name+(item.required_variables?"("+item.required_variables.join(",")+")":"")}</span>
        <span className='e-panel'>
          <EditTwoTone onClick={(e) => handleOpenEdit(e, item)} style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone onClick={(e) => handleDelete(e, item)}/>
        </span>
      </span>
  );
};

const StepsRightPanel = () => {
  const dispatch = useAppDispatch();

  const { selectedProjects } = useAppSelector(projectsSelector);
  const { resources:allResources } = useAppSelector(resourcesSelector);
  const [openCreateElement, setOpenCreateElement] = useState(false)
  const [actionEdit, setActionEdit] = useState({})
  const [searchText,setSearchText] = useState('')
  const { folders } = useAppSelector(foldersSelector);
  const [resources,setResources] = useState<Resource[]>([])
  const [h, setH] = useState<any>([]) 
  const [treeData,setTreeData] = useState<any[]>([])
  useEffect(()=>{
    setTreeData(GetTreeData(h))
  },[h])
  useEffect(() => {
    const fs = folders.filter((f:any)=>f.containerType=='Resource')
    const rs = resources
    var na:any = fs.map((f:any) => ({ ...f, resources: [] }))
    for (const r of rs) {
      const f = na.find((f:any) => r.folder && f.id ==  r.folder.id)
      if (f)
        f.resources = [...f.resources, r]
    }
    setH(Hierarchy(na,{resources:rs.filter(r=>!r.folder)}))
}, [resources, folders])
  const GetTreeData=(root:any):any[]=>{
    const data=[]
    if (root.children && root.children)
    for(const f of root.children){
      data.push({title:f.name,key:"f-"+f.id,isLeaf:false,children:GetTreeData(f)})
    }
    if(root.resources)
    for(const item of root.resources){
      if(item.actions && item.actions.length>0)
      data.push({title:item.name,isLeaf:false,key:"r-"+item.id,icon:()=><ContainerTwoTone/>,children:item.actions.map((a:any)=>({icon:<InteractionTwoTone/>,title:<DraggableItem
        handleOpenEdit={handleOpenEdit}
        handleDelete={handleDelete}
        item={{...a,resource:item}}
        type="RES_ACTION_TO_STEP"
      />,key:'a-'+a.id,isLeaf:true}))})
    }
    return SanitizeTreeData(data)
  }
  
  useEffect(()=>{
    setResources(allResources.map(r=>({...r,actions:r.actions.filter((a:any)=>{
      const tname=r.name+"."+a.name +(a.required_variables?"("+a.required_variables.join(",") +")":"")
      return tname.toLowerCase().includes(searchText.toLowerCase())
    }
    )})))
  },[searchText,allResources])
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchResources({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects]);

  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, item: any) => {
    e.stopPropagation()
    setOpenCreateElement(true)
    setActionEdit(item)
  }

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, action: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteAction({ id: action.id }))
  }
  const handleCancel = () => {
    setOpenCreateElement(false)
  }
  return (
    <div>
      {openCreateElement && <CreateActionModal action={actionEdit} open={openCreateElement} handleCancel={handleCancel} />}
      <Row>
        <Col span={24}>
          <Input style={{marginLeft:'4px'}} type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}/>
        </Col>
      </Row>
      <Row>
      <Col span={24} className='mt-6'>
        <DirectoryTree
        showLine
        multiple
        defaultExpandAll
        selectable={false}
        treeData={treeData}
        />
      </Col>
    </Row>
    </div>
  )
}
export default StepsRightPanel
