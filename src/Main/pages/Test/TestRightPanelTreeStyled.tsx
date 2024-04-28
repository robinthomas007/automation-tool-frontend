import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Tree } from 'antd';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchSteps, stepsSelector } from "./../../../redux/Slice/stepsSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { StepForwardOutlined } from '@ant-design/icons';
import { foldersSelector } from '../../../redux/Slice/foldersSlice';
import { Hierarchy } from '../../../Lib/helpers';
import { SanitizeTreeData } from '../../../Lib/helperComponents';
const { DirectoryTree } = Tree;
const DraggableItem = ({ item, type }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });


  return (
    <span ref={drag} style={{ cursor: 'move' }}>
      {item.name}
    </span>
  );
};

const TestRightPanel = () => {
  const dispatch = useAppDispatch();

  const { selectedProjects } = useAppSelector(projectsSelector);
  const { steps:allSteps } = useAppSelector(stepsSelector);
  const [searchText,setSearchText] = useState('')
  const [steps,setSteps] = useState<any[]>([])
  const { folders } = useAppSelector(foldersSelector);
  const [h, setH] = useState<any>([]) 
  const [treeData,setTreeData] = useState<any[]>([])
  useEffect(()=>{
    setTreeData(GetTreeData(h))
  },[h])
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
  const GetTreeData=(root:any):any[]=>{
    const data=[]
    if (root.children)
    for(const f of root.children){
      data.push({title:f.name,key:"f-"+f.id,isLeaf:false,children:GetTreeData(f)})
    }
    if(root.steps)
    for(const item of root.steps){
      data.push({title:<DraggableItem item={item} type="STEP_TO_TEST"/>,key:"s-"+item.id,isLeaf:true,icon:<StepForwardOutlined/>})
    }
    return SanitizeTreeData(data)
  }
  useEffect(()=>{
    setSteps(allSteps.filter(a=>{
      var tname=a.name
      tname = tname.toLowerCase()
      return tname.includes(searchText.toLowerCase())
    }))
  },[searchText,allSteps])
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchSteps({ projectId: selectedProjects.id, searchTerm: '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects])
  return (
    <div>
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
        treeData={treeData}
        />
        {/* <List
          header={<div className='flex flex-row'><span className='font-semibold'>Tests</span><Input style={{marginLeft:'4px'}} type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}/></div>}
          bordered
          dataSource={allTests}
          renderItem={(item, index) => (
            <List.Item>
              <DraggableListItem
                item={item}
                type="TEST_TO_SUITE"
                index={index}
              />
            </List.Item>
          )}
        /> */}
      </Col>
    </Row>
    </div>
  )
}
export default TestRightPanel