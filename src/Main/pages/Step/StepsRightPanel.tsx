
import React, { useEffect } from 'react'
import { Row, Col } from 'antd';
import { List } from 'antd';
import { HolderOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchResources, resourcesSelector } from "./../../../redux/Slice/resourcesSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";

const DraggableListItem = ({ item, type }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });


  return (
    <div ref={drag} style={{ cursor: 'move', padding: 15, width: '100%' }}>
      <HolderOutlined style={{ marginRight: 8 }} />
      {item.resource.name} - {item.name}
    </div>
  );
};

const StepsRightPanel = () => {
  const dispatch = useAppDispatch();

  const { selectedProjects } = useAppSelector(projectsSelector);
  const { resources } = useAppSelector(resourcesSelector);

  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchResources({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects]);

  const allActions = resources.flatMap(resource =>
    resource.actions.map(action => ({
      ...action,
      resource: resource
    }))
  );

  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Resource Actions</span>
            <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} />
          </div>}
          bordered
          dataSource={allActions}
          renderItem={(item, index) => (
            <List.Item style={{ padding: 0 }}>
              <DraggableListItem
                item={item}
                type="RES_ACTION_TO_STEP"
                index={index}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}
export default StepsRightPanel
