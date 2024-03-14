
import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd';
import { List } from 'antd';
import { HolderOutlined, PlusCircleTwoTone, DeleteTwoTone, EditTwoTone } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { deleteAction, fetchResources, resourcesSelector } from "./../../../redux/Slice/resourcesSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import CreateActionModal from './../Resource/CreateActionModal'

const DraggableListItem = ({ item, type, handleOpenEdit, handleDelete }: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });

  return (
    <div ref={drag} style={{ cursor: 'move', padding: 15, width: '100%' }}>
      <div className='element-panel' style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>
          <HolderOutlined style={{ marginRight: 8 }} />
          {item.resource.name} - {item.name}
        </span>
        <span>
          <EditTwoTone onClick={(e) => handleOpenEdit(e, item)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone onClick={(e) => handleDelete(e, item)} className="delete-icon" />
        </span>
      </div>
    </div>
  );
};

const StepsRightPanel = () => {
  const dispatch = useAppDispatch();

  const { selectedProjects } = useAppSelector(projectsSelector);
  const { resources } = useAppSelector(resourcesSelector);
  const [openCreateElement, setOpenCreateElement] = useState(false)
  const [actionEdit, setActionEdit] = useState({})

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

  const handleCancel = () => {
    setOpenCreateElement(false)
  }

  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, item: any) => {
    e.stopPropagation()
    setOpenCreateElement(true)
    setActionEdit(item)
  }

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, action: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteAction({ id: action.id }))
  }

  return (
    <Row style={{ marginTop: 20 }}>
      {openCreateElement && <CreateActionModal action={actionEdit} open={openCreateElement} handleCancel={handleCancel} />}
      <Col span={24}>
        <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Interactions</span>
            <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateElement(true)} />
          </div>}
          bordered
          dataSource={allActions}
          renderItem={(item, index) => (
            <List.Item style={{ padding: 0 }}>
              <DraggableListItem
                handleOpenEdit={handleOpenEdit}
                handleDelete={handleDelete}
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
