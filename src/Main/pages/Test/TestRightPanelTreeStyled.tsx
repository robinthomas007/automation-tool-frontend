import React, { useEffect, useState } from 'react'
import { Row, Col, Input } from 'antd';
import { List } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchSteps, stepsSelector } from "../../../redux/Slice/stepsSlice";
import { projectsSelector } from "../../../redux/Slice/projectsSlice";
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

const TestRightPanelTreeStyled = () => {
  const dispatch = useAppDispatch();

  const { selectedProjects } = useAppSelector(projectsSelector);
  const { steps } = useAppSelector(stepsSelector);
  const [searchText,setSearchText] = useState('')
  const [allSteps,setAllSteps] = useState<any[]>([])
  useEffect(()=>{
    setAllSteps(steps.filter(a=>{
      var tname=a.name
      tname = tname.toLowerCase()
      return tname.includes(searchText.toLowerCase())
    }))
  },[searchText,steps])
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchSteps({ projectId: selectedProjects.id, searchTerm: '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects])
  return (
    <Row>
      <Col span={24}>
        <List
          header={<div className='flex flex-row'><span className='font-semibold'>Steps</span><Input style={{marginLeft:'4px'}} type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}/></div>}
          bordered
          dataSource={allSteps}
          renderItem={(item, index) => (
            <List.Item>
              <DraggableListItem
                item={item}
                type="STEP_TO_TEST"
                index={index}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}
export default TestRightPanelTreeStyled