import React, { useEffect } from 'react'
import { Row, Col } from 'antd';
import { List } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchSteps, stepsSelector } from "./../../../redux/Slice/stepsSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
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

const TestRightPanel = () => {
  const dispatch = useAppDispatch();

  const { selectedProjects } = useAppSelector(projectsSelector);
  const { steps } = useAppSelector(stepsSelector);
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchSteps({ projectId: selectedProjects.id, searchTerm: '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects])
  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <List
          header={<div className='font-semibold'>Steps</div>}
          bordered
          dataSource={steps}
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
export default TestRightPanel