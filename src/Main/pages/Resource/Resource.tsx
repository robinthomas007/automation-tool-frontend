import { Resource as ResourceModel } from "./../../../redux/Slice/resourcesSlice";
import { Row, Col, Select, Button, Input, Collapse, AutoComplete } from 'antd';
import { List } from 'antd';
import CreateActionModal from "./CreateActionModal";

import reactStringReplace from 'react-string-replace';
import {
  HolderOutlined,
  CloseCircleOutlined,
  EditTwoTone,
  CloudUploadOutlined,
  DeleteTwoTone
} from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import {
  reOrderActionElement, getElementsByAction, resourcesSelector, addResElemToResActElem,
  removeElementFromAction, updateSelectedActionElements, saveSelectedActionChanges, deleteAction
} from "./../../../redux/Slice/resourcesSlice";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { useCallback, useEffect, useState } from "react";
import EditableText from "../../../Components/EditableText";
import EditableSelectableText from "../../../Components/EditableSelectableText";

function cp(commands: any[], elements: any[]) {
  var res = []
  for (const cm of commands) {
    for (const el of elements) {
      res.push({ cm, el })
    }
  }
  return res;
}

const DraggableListItem = ({ item, type, index, moveItem, resourceId, events, commands, handleRemoveElement, handleCommandDropdownChange, handleEventDropdownChange, handleInputChange, handleTimeoutChange, handleNewTabChange }: any) => {

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

  const onSearch = (value: string) => {
  };
  const commandObj = commands.find((command: any) => command.id === item.command_id);
  const eventObj = events.find((event: any) => event.id === item.event_id)

  const fiteredCommands = commands
    .filter((cmd: any) => item.type === cmd.applicable_on)
  const fiteredEvents = events
    .filter((cmd: any) => item.type === cmd.applicable_on)

  const filteredOptions = fiteredCommands.map((item: any) => ({
    label: item.name,
    value: item.id
  }));
  const filteredEventOptions = fiteredEvents.map((item: any) => ({
    label: item.name,
    value: item.id
  }));


  const template: string = commandObj?.template
  let rs = reactStringReplace(template, ' ', (match, i) => (
    <div key={`space-${i}`} style={{width:'5px'}}>
    </div>
  ))
  rs = reactStringReplace(rs, '$(Command)', (match, i) => (
    <div key={`command-${i}`}>
      <EditableSelectableText
        onChange={(e) => handleCommandDropdownChange(e, item.id, item.sequence_number)}
        value={item.command_id}
        options={filteredOptions}
      />
    </div>
  ))

  rs = reactStringReplace(rs, '$(Data)', (match, i) => (<div key={`data-${i}`}>
    {commandObj?.requires_input && <EditableText initialText={item.data_source} defaultText="Enter value" onChange={(e) => {
      handleInputChange(e, item.id, item.sequence_number)
    }} />}
  </div>))
  rs = reactStringReplace(rs, '$(Element)', (match, i) => (<div key={`elem-${i}`}>
    <span>'{item.name}'</span>
  </div>))
  const eventTemplate: string = ", waiting for " + eventObj?.template
  let ers = reactStringReplace(eventTemplate, ' ', (match, i) => (
    <div key={`space-${i}`} style={{width:'5px'}}>
    </div>
  ))
  ers = reactStringReplace(ers, '$(Event)', (match, i) => (
    <div key={`event-${i}`}>
      <EditableSelectableText
        onChange={(e) => handleEventDropdownChange(e, item.id, item.sequence_number)}
        value={item.event_id}
        options={filteredEventOptions}
      />
    </div>
  ))
  ers = reactStringReplace(ers, '$(Data)', (match, i) => (<div key={`data-${i}`}>
    {<EditableText initialText={item.event_data_source} defaultText="Enter value" onChange={(e) => {
      handleNewTabChange(e, item.id, item.sequence_number)
    }} />}
  </div>))
  let trs:any=" with $(Timeout) as timeout";
  trs = reactStringReplace(trs, ' ', (match, i) => (
    <div key={`space-${i}`} style={{width:'5px'}}>
    </div>
  ))
  trs = reactStringReplace(trs, '$(Timeout)', (match, i) => (<EditableText defaultText="auto" initialText={item.timeout} onChange={(value) => { handleTimeoutChange(value, item.id, item.sequence_number) }} />))
  return (
    <div ref={(node) => drag(drop(node))} style={{ padding: 10, alignItems: 'center', display: 'flex', width: '100%', justifyContent: 'space-between' }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} >
      <HolderOutlined style={{ cursor: 'move' }} />
      <div style={{ display: 'flex', flexDirection: 'row' , flexWrap:'wrap', marginRight:'auto', marginLeft:'5px'}}>
            {rs}
            {filteredEventOptions.length>0?ers:""}
            {trs}
      </div>
      
      <CloseCircleOutlined onClick={() => handleRemoveElement({ id: item.element_id, sequence_number: item.sequence_number })} style={{ padding: 2, marginLeft: 10, visibility: hover ? 'visible' : 'hidden' }} className="close-icon-15" />
    </div>
  );
};


const Resource = ({ resource }: { resource: ResourceModel }) => {

  const dispatch = useAppDispatch();

  const [selectedActionTab, setSelectedActionTab] = useState<any>(resource?.actions[0]?.id)
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const [actionEdit, setActionEdit] = useState({})
  const { selectedActionElements, commands, events } = useAppSelector(resourcesSelector);

  const moveItem = (fromIndex: number, toIndex: number, type: string, resourceId: number) => {
    dispatch(reOrderActionElement({ fromIndex, toIndex }));
  };

  const handleCancel = () => {
    setOpenEdit(false)
    setActionEdit({})
  }

  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, action: any) => {
    // e.stopPropagation()
    setOpenEdit(true)
    setActionEdit(action)
  }

  useEffect(() => {
    if (selectedActionTab)
      dispatch(getElementsByAction(selectedActionTab));
  }, [selectedActionTab, resource])


  const [, drop] = useDrop({
    accept: 'RESOURCE_ELEMENTS_TO_RESOURCE',
    drop: (item) => {
      dispatch(addResElemToResActElem({ item, command: commands[0] }));
    }
  });

  const handleRemoveElement = ({ id, sequence_number }: { id: number, sequence_number: number }) => {
    dispatch(removeElementFromAction({ id, sequence_number }));
  };

  const onChange = (key: string | string[]) => {
    const index: any = key[key.length - 1]
    if (index) {
      setSelectedActionTab(resource.actions[index].id)
    }
  };

  const handleInputChange = (e: string, itemId: number, sequence_number: number) => {
    const newValue = e;
    const updatedItems = selectedActionElements.element_actions.map((item: any) => {
      if (item.id === itemId && item.sequence_number === sequence_number) {
        return { ...item, data_source: newValue };
      }
      return item;
    });

    dispatch(updateSelectedActionElements(updatedItems));
  };
  const handleTimeoutChange = (e: string, itemId: number, sequence_number: number) => {
    const newValue = e;
    const updatedItems = selectedActionElements.element_actions.map((item: any) => {
      if (item.id === itemId && item.sequence_number === sequence_number) {
        return { ...item, timeout: newValue };
      }
      return item;
    });

    dispatch(updateSelectedActionElements(updatedItems));
  };
  const handleNewTabChange = (e: string, itemId: number, sequence_number: number) => {
    const newValue = e;
    const updatedItems = selectedActionElements.element_actions.map((item: any) => {
      if (item.id === itemId && item.sequence_number === sequence_number) {
        return { ...item, newtab: newValue };
      }
      return item;
    });

    dispatch(updateSelectedActionElements(updatedItems));
  };
  const handleCommandDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>, itemId: number, sequence_number: number) => {
    const newValue = e;
    const updatedItems = selectedActionElements.element_actions.map((item: any) => {
      if (item.id === itemId && item.sequence_number == sequence_number) {
        return { ...item, command_id: newValue };
      }
      return item;
    });

    dispatch(updateSelectedActionElements(updatedItems));
  };
  const handleEventDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>, itemId: number, sequence_number: number) => {
    const newValue = e;
    const updatedItems = selectedActionElements.element_actions.map((item: any) => {
      if (item.id === itemId && item.sequence_number == sequence_number) {
        return { ...item, event_id: newValue };
      }
      return item;
    });

    dispatch(updateSelectedActionElements(updatedItems));
  };

  const saveSelectedAction = (e: any) => {
    e.stopPropagation()
    dispatch(saveSelectedActionChanges({ id: selectedActionTab, data: selectedActionElements }))
  }
  const items = cp(commands, resource.elements).filter(({ cm, el }) => el.type === cm.applicable_on)
  const options = items.map(e => {
    const c = e.cm.template.replace('$(Element)', e.el.name).replace('$(Command)', e.cm.name)
    return {
      label: c,
      value: e.cm.id + "-" + e.el.id,
    }
  })
  const onNewStep = useCallback((value: string) => {
    const split = value.split("-").map(item => Number(item));
    const command = commands.find(c => Number(c.id) === split[0])
    const item = resource.elements.find(c => Number(c.id) === split[1])
    dispatch(addResElemToResActElem({ item, command }));
  }, [commands, resource])


  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, action: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteAction({ id: action.id }))
  }

  const resourceActions = resource.actions.map((action: any, index: any) => (
    <Collapse.Panel
      header={<div className="res-action-header" style={{ display: 'flex', alignItems: 'center' }}><span>{action.name} </span>
      </div>}
      key={index}
      className="resource-action-panel"
      extra={<div className="resource-action-panel-extra">
        <EditTwoTone onClick={(e) => handleOpenEdit(e, action)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
        <DeleteTwoTone onClick={(e) => handleDelete(e, action)} className="delete-icon" />
      </div>
      }
      ref={selectedActionTab === action.id ? drop : undefined}
    >
      <List
        bordered
        header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, color: '#1577ff' }}> Elements Action Sequence</h4>
          <CloudUploadOutlined onClick={saveSelectedAction} title="save" />
        </div>}
      >
        {selectedActionElements.element_actions && selectedActionElements.element_actions.map((item: any, index: number) => (
          <List.Item style={{ padding: 0 }} key={item.element_id + "-" + item.sequence_number}>
            <DraggableListItem
              item={item}
              type={ItemTypes.ELEMENT}
              index={index}
              moveItem={moveItem}
              resourceId={resource.id}
              handleCommandDropdownChange={handleCommandDropdownChange}
              handleEventDropdownChange={handleEventDropdownChange}
              events={events}
              commands={commands}
              handleRemoveElement={handleRemoveElement}
              handleInputChange={handleInputChange}
              handleTimeoutChange={handleTimeoutChange}
              handleNewTabChange={handleNewTabChange}
            />
          </List.Item>
        ))}
        <List.Item>
          <Select
            style={{ width: '100%' }}
            showSearch
            optionFilterProp="label"
            placeholder="Next Step"
            onChange={onNewStep}
            options={options}
            value={''}
          />
        </List.Item>
      </List>
    </Collapse.Panel>
  ));

  return (
    <Row>
      <Col span={24}>
        {openEdit && actionEdit && <CreateActionModal action={actionEdit} open={openEdit} handleCancel={handleCancel} />}

        <Collapse onChange={onChange} accordion destroyInactivePanel={true} style={{ marginTop: 10 }} >
          {resourceActions}
        </Collapse>
      </Col>
    </Row>
  );
};

export default Resource;
