import React, { useState } from 'react'
import { Suite as SuiteModel, addFolderToSuite } from "./../../../redux/Slice/suitesSlice";
import { Row, Col, List, Button } from 'antd';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { addTestToSuite, updateSuite, removeTestFromSuite } from "./../../../redux/Slice/suitesSlice";
import {
  CloseCircleOutlined,
  SaveTwoTone
} from '@ant-design/icons';
const Suite = ({ suite }: { suite: SuiteModel }) => {
  const dispatch = useAppDispatch();
  const [hover, setHover] = useState(false)

  const [, drop] = useDrop({
    accept: 'TEST_TO_SUITE',
    drop: (item) => {
      dispatch(addTestToSuite({ item }));
    }
  });
  const [, dropFolder] = useDrop({
    accept: 'FOLDER_TO_SUITE',
    drop: (item) => {
      // alert(JSON.stringify(item))
      dispatch(addFolderToSuite({ item }));
    }
  });

  const handleRemoveStep = ({ id }: { id: string }) => {
    dispatch(removeTestFromSuite({ id }));
  };

  return (
    <Row ref={suite.type=='Container'?drop:null}>
      <Col span={24} ref={dropFolder}>
        <List
          header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tests</span>
            <SaveTwoTone onClick={(e) => dispatch(updateSuite({ suite }))} title="save" />
          </div>}
          bordered
          dataSource={suite.tests ? suite.tests : []}
          renderItem={(item) => (
            <List.Item>
              <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span>{item.name}</span>
                <CloseCircleOutlined onClick={() => handleRemoveStep({ id: item.id })} style={{ visibility: hover ? 'visible' : 'hidden', marginLeft: 10 }} />
              </div>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default Suite;
