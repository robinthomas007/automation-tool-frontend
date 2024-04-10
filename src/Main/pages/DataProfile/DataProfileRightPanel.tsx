import React, { useEffect, useState } from 'react'
import { Row, Col } from 'antd';
import { List, Button, Input } from 'antd';
import { HolderOutlined } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { fetchVariables, dataProfileSelector } from "./../../../redux/Slice/dataProfileSlice";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import CreateVariableModal from './CreateVariableModal'

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

const DataProfileRightPanel = () => {
  const { variables } = useAppSelector(dataProfileSelector);
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const { selectedProjects } = useAppSelector(projectsSelector);
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    setOpenCreate(false)
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