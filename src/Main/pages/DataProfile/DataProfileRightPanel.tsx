import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd';
import { List, Button, Input } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { fetchVariables, dataProfileSelector, deleteVariable } from "./../../../redux/Slice/dataProfileSlice";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import CreateVariableModal from './CreateVariableModal'
import {
  DeleteTwoTone
} from '@ant-design/icons';
const DraggableListItem = ({ item, type ,handleDelete}: any) => {

  const [, drag] = useDrag({
    type,
    item: item,
  });

  return (
    <div ref={drag} style={{ cursor: 'move' }} className='w-full flex flex-row element-panel'>
      <div>
      <HolderOutlined style={{ marginRight: 8 }} />
      {item.name}
      </div>
      <span className='ml-auto'>
        <DeleteTwoTone onClick={(e) => handleDelete(e, item)} className="delete-icon" />
      </span>
    </div>
  );
};

const DataProfileRightPanel = () => {
  const { variables } = useAppSelector(dataProfileSelector);
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const { selectedProjects } = useAppSelector(projectsSelector);
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setOpenCreate(false)
  }
  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, variable: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteVariable({ id: variable.id }))
  }
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchVariables({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects]);

  return (
    <div>
      <Row>
        {/* <Col span={12}>
          <Input placeholder="Search Test" />
        </Col> */}
        <Col span={12} style={{ textAlign: 'left' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Variables </Button>
          <CreateVariableModal open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <List
            header={<div className='font-semibold'>Variables</div>}
            bordered
            dataSource={variables}
            renderItem={(item, index) => (
              <List.Item>
                <DraggableListItem
                  item={item}
                  type="VARIABLE_TO_PROFILE"
                  index={index}
                  handleDelete={handleDelete}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>

  )
}
export default DataProfileRightPanel