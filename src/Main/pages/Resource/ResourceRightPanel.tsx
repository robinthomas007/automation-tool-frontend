
import React, { useState } from 'react'
import { Resource as ResourceModel } from "./../../../redux/Slice/resourcesSlice";
import { Row, Col } from 'antd';
import { List } from 'antd';
import { HolderOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import CreateElementModal from './CreateElementmodal'
const DraggableListItem = ({ item, type }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });


  return (
    <div ref={drag} style={{ cursor: 'move', padding: 14, width: '100%' }}>
      <HolderOutlined style={{ marginRight: 8 }} />
      {item.name}
    </div>
  );
};

const ResourceRightPanel = ({ resource }: { resource: ResourceModel }) => {

  const [openCreateElement, setOpenCreateElement] = useState(false)

  const handleCancel = () => {
    setOpenCreateElement(false)
  }

  return (
    <Row style={{ marginTop: 20 }}>
      <CreateElementModal open={openCreateElement} handleCancel={handleCancel} />
      <Col span={24}>
        <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{resource.name} Elements</span>
            <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateElement(true)} />
          </div>}
          bordered
          dataSource={resource.elements}
          renderItem={(item, index) => (
            <List.Item style={{ padding: 0 }}>
              <DraggableListItem
                item={item}
                type="RESOURCE_ELEMENTS_TO_RESOURCE"
                index={index}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}
export default ResourceRightPanel
