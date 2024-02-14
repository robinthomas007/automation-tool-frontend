import React from 'react'
import { Test as TestModel } from "./../../../redux/Slice/testsSlice";
import { Row, Col } from 'antd';
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

  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <List
          header={<div>Tests</div>}
          bordered
          dataSource={selectedProjects?.tests}
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