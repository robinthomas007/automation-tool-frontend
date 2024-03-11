
import React, { useState } from 'react'
import { Resource as ResourceModel, deleteElement, resourcesSelector } from "./../../../redux/Slice/resourcesSlice";
import { Row, Col } from 'antd';
import { List } from 'antd';
import { HolderOutlined, PlusCircleTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import CreateElementModal from './CreateElementmodal'
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";

const DraggableListItem = ({ item, type, handleOpenEdit, handleDelete }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });

  return (
    <div ref={drag} style={{ cursor: 'move', padding: 14, width: '100%' }}>
      <div className='element-panel' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <HolderOutlined style={{ marginRight: 8 }} />
          {item.name}
        </span>
        <span>
          <EditTwoTone onClick={(e) => handleOpenEdit(e, item)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone onClick={(e) => handleDelete(e, item)} className="delete-icon" />
        </span>
      </div>
    </div>
  );
};

const ResourceRightPanel = () => {

  const [openCreateElement, setOpenCreateElement] = useState(false)
  const [elementEdit, setElementEdit] = useState({})
  const dispatch = useAppDispatch();
  const { selectedResources } = useAppSelector(resourcesSelector);

  const handleCancel = () => {
    setOpenCreateElement(false)
  }

  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, item: any) => {
    e.stopPropagation()
    setOpenCreateElement(true)
    setElementEdit(item)
  }

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, element: any) => {
    e.stopPropagation()
    dispatch(deleteElement({ id: element.id }))
  }

  return (
    <Row style={{ marginTop: 20 }}>
      {openCreateElement && <CreateElementModal element={elementEdit} open={openCreateElement} handleCancel={handleCancel} />}
      <Col span={24}>
        <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{selectedResources.name} Properties</span>
            <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateElement(true)} />
          </div>}
          bordered
          dataSource={selectedResources.elements || []}
          renderItem={(item, index) => (
            <List.Item style={{ padding: 0 }}>
              <DraggableListItem
                handleOpenEdit={handleOpenEdit}
                handleDelete={handleDelete}
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
