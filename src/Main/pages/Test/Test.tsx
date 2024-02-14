import { Test as TestModel } from "./../../../redux/Slice/testsSlice";
import { Row, Col, List } from 'antd';
import { useDrop, useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { addStepToTest, reOrderTestSteps, addStepDataToTest } from "./../../../redux/Slice/testsSlice";
import {
  HolderOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { fetchTests, testsSelector, selectTests } from "./../../../redux/Slice/testsSlice";

const DraggableListItem = ({ item, type, index, moveItem, handleStepData }: any) => {

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
    <div ref={(node) => drag(drop(node))} style={{ padding: 5, width: '100%', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <HolderOutlined style={{ marginRight: 8, cursor: 'move' }} />
        <span style={{ cursor: 'pointer' }} onClick={() => handleStepData(item)}> {item.step.name}</span>
      </div>
      {/* <div>
        {Number(item.id) % 2 === 0 ? <CheckOutlined style={{ color: '#98cf8c' }} /> : <CloseOutlined style={{ color: '#db3b3b' }} />}
      </div> */}
    </div>
  );
};

const Test = ({ test }: { test: TestModel }) => {
  const dispatch = useAppDispatch();
  const { selectedTests } = useAppSelector(testsSelector);


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
    console.log(item, 11)
    dispatch(addStepDataToTest({ item }));
  }

  return (
    <Row ref={drop}>
      <Col span={24}>
        <List
          header={<div>Steps</div>}
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
              />

            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default Test;
