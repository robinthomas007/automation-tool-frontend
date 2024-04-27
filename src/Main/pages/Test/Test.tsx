import React, { useState } from 'react'
import { Test as TestModel } from "./../../../redux/Slice/testsSlice";
import { Row, Col, List } from 'antd';
import { useDrop, useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { addStepToTest, reOrderTestSteps, addStepDataToTest, updateTest, removeStepFromTest } from "./../../../redux/Slice/testsSlice";
import {
  HolderOutlined,
  CloseCircleOutlined,
  SaveTwoTone
} from '@ant-design/icons';
import { testsSelector } from "./../../../redux/Slice/testsSlice";

const DraggableListItem = ({ item, type, index, moveItem, handleStepData, handleRemoveStep, selectedStep }: any) => {

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
        moveItem(draggedIndex, index, type);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={selectedStep.step_id === item.step_id && selectedStep.sequence_number === item.sequence_number ? 'selected-step' : ''}
      style={{ padding: 5, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <HolderOutlined style={{ marginRight: 8, cursor: 'move' }} />
        <span style={{ cursor: 'pointer' }} onClick={() => handleStepData(item)}> {item.step.name}</span>
      </div>
      <div>
        <CloseCircleOutlined onClick={() => handleRemoveStep({ id: item.id, sequence_number: item.sequence_number })} style={{ visibility: hover ? 'visible' : 'hidden', marginLeft: 10 }} />
      </div>
    </div>
  );
};

const Test = ({ test }: { test: TestModel }) => {
  const dispatch = useAppDispatch();
  const { selectedStep } = useAppSelector(testsSelector);

  const [, drop] = useDrop({
    accept: 'STEP_TO_TEST',
    drop: (item) => {
      dispatch(addStepToTest({ item }));
    }
  });

  const moveItem = (fromIndex: number, toIndex: number) => {
    dispatch(reOrderTestSteps({ fromIndex, toIndex }));
  };

  const handleStepData = (item: any) => {
    dispatch(addStepDataToTest({ item }));
  }

  const handleRemoveStep = ({ id, sequence_number }: { id: number, sequence_number: number }) => {
    dispatch(removeStepFromTest({ id, sequence_number }));
  };

  return (
    <Row ref={drop}>
      <Col span={24}>
        <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Steps</span>
            <SaveTwoTone onClick={(e) => dispatch(updateTest({ test }))} title="save" />
          </div>}
          bordered
          dataSource={test.steps ? test.steps : []}
          renderItem={(item, index) => (
            <List.Item>
              <DraggableListItem
                item={item}
                type={"TEST_REORDER"}
                index={index}
                moveItem={moveItem}
                handleStepData={handleStepData}
                handleRemoveStep={handleRemoveStep}
                selectedStep={selectedStep}
              />

            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default Test;
