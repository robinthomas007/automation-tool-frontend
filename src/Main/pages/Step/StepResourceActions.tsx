import React from 'react'
import { Step as StepModel } from "./../../../redux/Slice/stepsSlice";
import { useDrag, useDrop } from 'react-dnd';
import { Row, Col, List } from 'antd';
import { useAppDispatch } from "./../../../redux/hooks";
import { addResActToStep, reOrderStepsActions } from "./../../../redux/Slice/stepsSlice";
import {
  ArrowDownOutlined
} from '@ant-design/icons';

const DraggableListItem = ({ item, type, index, moveItem, step }: any) => {

  const [, drag] = useDrag({
    type,
    item: { id: item.id, type, index },
  });

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

  console.log(item)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 10, position: 'relative' }}>
      <div ref={(node) => drag(drop(node))} style={{ border: "1px solid #6ca9d9", padding: 12 }}>
        <span>{item?.resource_action?.resource?.name} : {item?.resource_action?.name}</span>
      </div>
      {step?.resource_actions && step?.resource_actions[index + 1] && <ArrowDownOutlined style={{ position: 'absolute', top: 60 }} />}
    </div>
  );
};

export default function StepResourceActions({ step }: { step: StepModel }) {
  const dispatch = useAppDispatch();

  const [, drop] = useDrop({
    accept: 'RES_ACTION_TO_STEP',
    drop: (item) => {
      dispatch(addResActToStep({ item }));
    }
  });


  const moveItem = (fromIndex: number, toIndex: number) => {
    dispatch(reOrderStepsActions({ fromIndex, toIndex }));
  };

  console.log(step, 'stepstep00')

  return (
    <Row ref={drop}>
      <Col span={24}>
        <List
          header={<div>Resource Actions</div>}
          bordered
          dataSource={step?.resource_actions ? step.resource_actions : []}
          renderItem={(item, index) => (
            <DraggableListItem
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
