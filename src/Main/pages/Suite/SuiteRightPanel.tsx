import React, { useEffect, useState } from 'react'
import { Test as TestModel } from "./../../../redux/Slice/testsSlice";
import { Row, Col, Input } from 'antd';
import { List } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { useAppSelector } from "./../../../redux/hooks";

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
  const { selectedProjects } = useAppSelector(projectsSelector);
  const [searchText,setSearchText] = useState('')
  const [allTests,setAllTests] = useState<any[]>([])
  useEffect(()=>{
    if (selectedProjects)
    setAllTests(selectedProjects?.tests.filter(a=>{
      var tname=a.name
      tname = tname.toLowerCase()
      return tname.includes(searchText.toLowerCase())
    }))
  },[selectedProjects,searchText])
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