import React, { useState, useEffect } from 'react'
import { Step as StepModel, updateStep, selectResourceAction } from "./../../../redux/Slice/stepsSlice";
import { useDrag, useDrop } from 'react-dnd';
import { Row, Col, List, Button, Checkbox, Input } from 'antd';
import { useAppDispatch } from "./../../../redux/hooks";
import { addResActToStep, addActionDataToStep, reOrderStepsActions, updateSelectedStepAction, removeActionFromResource } from "./../../../redux/Slice/stepsSlice";
import {
  ArrowDownOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import EditableText from '../../../Components/EditableText';

const DraggableListItem = ({ item, type, index, moveItem, step, handleInputChange, handleRemoveAction, handleResourceActionData }: any) => {

  const [, drag] = useDrag({
    type,
    item: { id: item.id, type, index },
  });

  const [hover, setHover] = useState(false)


  const [, drop] = useDrop({
    accept: type,
    drop: (draggedItem: any) => {
      const draggedIndex = draggedItem.index;
      if (draggedIndex !== index) {
        moveItem(draggedIndex, index, type);
        draggedItem.index = index;
      }
    },
  });

  const data = item.data ? item.data : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10, position: 'relative' }}>
      <div ref={(node) => drag(drop(node))} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10, border: "1px solid #ddd",
        width: '100%', background: '#fff', color: '#6e707e'

      }}>
        <span onClick={(e) => {
          e.stopPropagation()
          handleResourceActionData(item)
        }}>{item?.resource_action?.resource?.name}.{item?.resource_action?.name}({data.map((d: any) => d.name + "=" + (d.expression == "" ? "inherited" : d.expression)).join(',')})</span>
        <span style={{ display: 'flex', flexDirection: 'row', marginLeft: 'auto' }}>enabled: <EditableText defaultText="Enter value" initialText={item?.enabled ? item?.enabled : 'true'} onChange={(value) => { handleInputChange(value, item.id, item.sequence_number) }} /></span>
        <CloseCircleOutlined onClick={() => handleRemoveAction({ id: item.id, sequence_number: item.sequence_number })} style={{ visibility: hover ? 'visible' : 'hidden', marginLeft: 10 }} />
      </div>
      {step?.resource_actions && step?.resource_actions[index + 1] && <ArrowDownOutlined style={{ position: 'absolute', top: 54 }} />}
    </div>
  );
};

export default function Step({ step }: { step: StepModel }) {
  const dispatch = useAppDispatch();

  const [, drop] = useDrop({
    accept: 'RES_ACTION_TO_STEP',
    drop: (item) => {
      dispatch(addResActToStep({ item }));
    }
  });

  useEffect(() => {
    return () => {
      console.log("Remove")
      dispatch(selectResourceAction({}))
    }
  }, []);


  const moveItem = (fromIndex: number, toIndex: number) => {
    dispatch(reOrderStepsActions({ fromIndex, toIndex }));
  };

  const handleInputChange = (newValue: string, itemId: number, sequence_number: number) => {
    const resActions = step.resource_actions || []
    const updatedItems = resActions.map((item: any) => {
      if (item.id === itemId && item.sequence_number === sequence_number) {
        return { ...item, enabled: newValue };
      }
      return item;
    });

    dispatch(updateSelectedStepAction(updatedItems));
  };

  const handleRemoveAction = ({ id, sequence_number }: { id: number, sequence_number: number }) => {
    dispatch(removeActionFromResource({ id, sequence_number }));
  };
  const handleResourceActionData = (item: any) => {
    dispatch(addActionDataToStep({ item }));
  }
  return (
    <Row ref={drop}>
      <Col span={24}>
        <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4 style={{ margin: 0, color: '#1577ff' }}>Interactions</h4>
            <CloudUploadOutlined onClick={(e) => dispatch(updateStep({ step }))} title="save" />
            {/* <Button style={{ fontSize: 12 }} type='primary' size='small' onClick={(e) => dispatch(updateStep({ step }))}>Save</Button> */}

          </div>}
          bordered
          dataSource={step?.resource_actions ? step.resource_actions : []}
          renderItem={(item, index) => (
            <DraggableListItem
              handleInputChange={handleInputChange}
              handleRemoveAction={handleRemoveAction}
              handleResourceActionData={handleResourceActionData}
              item={item}
              type={"STEP_REORDER"}
              index={index}
              moveItem={moveItem}
              step={step}
            />
          )}
        />
      </Col>
    </Row>
  )
}
