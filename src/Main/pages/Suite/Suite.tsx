import { Suite as SuiteModel } from "./../../../redux/Slice/suitesSlice";
import { Row, Col, List, Button } from 'antd';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { addTestToSuite } from "./../../../redux/Slice/suitesSlice";
import {
  CloseCircleOutlined,
} from '@ant-design/icons';
const Suite = ({ suite }: { suite: SuiteModel }) => {
  const dispatch = useAppDispatch();

  const [, drop] = useDrop({
    accept: 'TEST_TO_SUITE',
    drop: (item) => {
      dispatch(addTestToSuite({ item }));
    }
  });

  return (
    <Row ref={drop}>
      <Col span={24}>
        <List
          header={<div>Tests</div>}
          bordered
          dataSource={suite.tests ? suite.tests : []}
          renderItem={(item) => (
            <List.Item>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <span>{item.name}</span>                <CloseCircleOutlined />
              </div>

            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
};

export default Suite;
