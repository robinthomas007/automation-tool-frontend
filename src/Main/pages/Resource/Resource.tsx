import { Resource as ResourceModel } from "./../../../redux/Slice/resourcesSlice";
import { Row, Col, Select, Button, Input, Collapse } from 'antd';
import { List } from 'antd';
import {
  HolderOutlined,
  PlusCircleTwoTone,
  InteractionOutlined,
  BlockOutlined,
  CloseCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { reOrderResource, reOrderActionElement, getElementsByAction, resourcesSelector, addResElemToResActElem, removeElementFromAction } from "./../../../redux/Slice/resourcesSlice";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { useEffect, useState } from "react";
import CreateActionModal from './CreateActionModal'

const DraggableListItem = ({ item, type, index, moveItem, resourceId, commands, handleRemoveElement }: any) => {

  const [hover, setHover] = useState(false)

  const [, drag] = useDrag({
    type,
    item: { id: item.id, type, index },
  });

  const [, drop] = useDrop({
    accept: type,
    drop: (draggedItem: any) => {
      const draggedIndex = draggedItem.index;
      if (draggedIndex !== index) {
        moveItem(draggedIndex, index, type, resourceId);
        draggedItem.index = index;
      }
    },
  });

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const commandObj = commands.find((command: any) => command.name === item.command);

  const filteredOptions = commands
    .filter((cmd: any) => item.type === cmd.applicable_on)
    .map((item: any) => ({
      label: item.name,
      value: item.id
    }));

  return (
    <div ref={(node) => drag(drop(node))} style={{ padding: 10, alignItems: 'center', display: 'flex', width: '100%', justifyContent: 'space-between' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >
      <div>
        <HolderOutlined style={{ marginRight: 8, cursor: 'move' }} />
        <Select
          showSearch
          placeholder="Actions"
          onChange={onChange}
          onSearch={onSearch}
          value={item.command}
          style={{ width: 80 }}
          options={filteredOptions}
        />
      </div>
      <div style={{ marginLeft: 20 }}>
        <span>{item.name}</span>
      </div>
      <div style={{ marginLeft: 'auto' }}>
        {commandObj.requires_input && <Input placeholder="Enter value" />}
      </div>
      <CloseCircleOutlined onClick={() => handleRemoveElement({ id: item.id })} style={{ padding: 2, marginLeft: 10, visibility: hover ? 'visible' : 'hidden' }} className="close-icon-15" />
    </div>
  );
};


const Resource = ({ resource }: { resource: ResourceModel }) => {

  const dispatch = useAppDispatch();

  const [selectedActionTab, setSelectedActionTab] = useState<any>(resource?.actions[0]?.id)

  const { selectedActionElements, commands } = useAppSelector(resourcesSelector);

  const moveItem = (fromIndex: number, toIndex: number, type: string, resourceId: number) => {
    dispatch(reOrderActionElement({ fromIndex, toIndex }));
  };

  useEffect(() => {
    if (selectedActionTab)
      dispatch(getElementsByAction(selectedActionTab));
  }, [selectedActionTab, resource])


  // const dispatch = useAppDispatch();

  const [, drop] = useDrop({
    accept: 'RESOURCE_ELEMENTS_TO_RESOURCE',
    drop: (item) => {
      dispatch(addResElemToResActElem({ item }));
    }
  });

  const handleRemoveElement = (id: any) => {
    dispatch(removeElementFromAction(id));
  };

  const onChange = (key: string | string[]) => {
    const index: any = key[key.length - 1]
    if (index) {
      setSelectedActionTab(resource.actions[index].id)
    }
  };

  const resourceActions = resource.actions.map((action: any, index: any) => (
    <Collapse.Panel
      header={action.name}
      key={index}
      extra={
        <Button type="primary">Save</Button>
      }

    >
      <List
        bordered
        dataSource={selectedActionElements && selectedActionElements.elemAction ? selectedActionElements.elemAction : []}
        renderItem={(item, index) => (
          <List.Item style={{ padding: 0 }}>
            <DraggableListItem
              item={item}
              type={ItemTypes.ELEMENT}
              index={index}
              moveItem={moveItem}
              resourceId={resource.id}
              commands={commands}
              handleRemoveElement={handleRemoveElement}
            />
          </List.Item>
        )}
      // locale={{
      //   emptyText: <List.Item style={{ display: 'flex', justifyContent: 'center' }}>
      //     <LoadingOutlined />
      //   </List.Item>
      // }}
      />
    </Collapse.Panel>
  ));

  return (
    <Row>
      <Col span={24}>
        <Collapse onChange={onChange} accordion destroyInactivePanel={true} style={{ marginTop: 10 }} >
          {resourceActions}
        </Collapse>
        {/* <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><InteractionOutlined style={{ color: '#1577ff', marginRight: 10 }} /> Actions</span>
            <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateAction(true)} />
          </div>}
          bordered
          dataSource={resource.actions ? resource.actions : []}
          renderItem={(item: any, index) => (
            <List.Item>

              <span onClick={() => setSelectedActionTab(item.id)} className={item.id === selectedActionTab ? 'active-action' : ""}>
                {item.name}
              </span>
            </List.Item>
          )}
          locale={{
            emptyText: <List.Item>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <PlusCircleTwoTone style={{ marginBottom: 10, fontSize: 22 }} onClick={() => setOpenCreateAction(true)} />
                <span>No actions added yet</span>
              </div>
            </List.Item>
          }}
        /> */}
      </Col>
    </Row>
  );
};

export default Resource;
