import React, { useCallback, useEffect, useState } from 'react'
import { Test as TestModel, fetchTests, testsSelector } from "../../../redux/Slice/testsSlice";
import { Row, Col, Input, Tree } from 'antd';
import { List } from 'antd';
import { ExperimentTwoTone } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { projectsSelector } from "../../../redux/Slice/projectsSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { Hierarchy } from '../../../Lib/helpers';
import { foldersSelector } from '../../../redux/Slice/foldersSlice';
import { title } from 'process';
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

const SuiteRightPanel = () => {
  const dispatch = useAppDispatch()
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { tests:allTests } = useAppSelector(testsSelector);
  const [searchText,setSearchText] = useState('')
  const [tests,setTests] = useState<any[]>([])
  const { folders } = useAppSelector(foldersSelector);
  const [treeData,setTreeData] = useState<any[]>([])
  const [h, setH] = useState<any>([]) 
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
  const GetTreeData=(root:any):any[]=>{
    const data=[]
    if (root.children)
    for(const f of root.children){
      data.push({title:<DraggableItem item={f} type="FOLDER_TO_SUITE"/>,key:f.id,isLeaf:false,children:GetTreeData(f)})
    }
    if(root.tests)
    for(const item of root.tests){
      data.push({title:<DraggableItem item={item} type="TEST_TO_SUITE"/>,key:item.id,isLeaf:true,icon:<ExperimentTwoTone/>})
    }
    return data
  }
  useEffect(()=>{
    if(tests.length==0 && selectedProjects){
      dispatch(fetchTests({projectId:selectedProjects.id,searchTerm:''}))
    }
  },[selectedProjects])
  useEffect(()=>{
    if (selectedProjects)
    setTests(allTests.filter(a=>{
      var tname=a.name
      tname = tname.toLowerCase()
      return tname.includes(searchText.toLowerCase())
    }))
  },[allTests,searchText])
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
        treeData={GetTreeData(h)}
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
export default SuiteRightPanel