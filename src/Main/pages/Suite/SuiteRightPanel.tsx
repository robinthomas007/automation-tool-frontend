import React, { useEffect, useState } from 'react'
import { Test as TestModel, fetchTests, testsSelector } from "./../../../redux/Slice/testsSlice";
import { Row, Col, Input } from 'antd';
import { List } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";

const DraggableListItem = ({ item, type }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });


  return (
    <div ref={drag} style={{ cursor: 'move' }}>
      <HolderOutlined style={{ marginRight: 8 }} />
      {item.name}
    </div>
  );
};

const SuiteRightPanel = () => {
  const dispatch = useAppDispatch()
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { tests } = useAppSelector(testsSelector);
  const [searchText,setSearchText] = useState('')
  const [allTests,setAllTests] = useState<any[]>([])
  useEffect(()=>{
    if(tests.length==0 && selectedProjects){
      dispatch(fetchTests({projectId:selectedProjects.id,searchTerm:''}))
    }
  },[selectedProjects])
  useEffect(()=>{
    if (selectedProjects)
    setAllTests(tests.filter(a=>{
      var tname=a.name
      tname = tname.toLowerCase()
      return tname.includes(searchText.toLowerCase())
    }))
  },[tests,searchText])
  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <List
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
        />
      </Col>
    </Row>
  )
}
export default SuiteRightPanel