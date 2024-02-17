import { RunDataItem, Run as RunModel } from "../../../redux/Slice/runsSlice";
import { Row, Col, List, Button } from 'antd';
import { useDrop } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addTestToSuite } from "../../../redux/Slice/suitesSlice";
import {
  CloseCircleOutlined,
} from '@ant-design/icons';
const Run = ({ run }: { run: RunModel }) => {
  return (
    <Row>
      <Col span={24}>
        <RunItem item={run.result}/>
      </Col>
    </Row>
  );
};
const RunItem=({item}:{item:RunDataItem})=>{
  return item.items.length>0?(<List
  header={<div>{item.name}</div>}
  bordered
  dataSource={item.items ? item.items : []}
  renderItem={(i) => (
    <List.Item>
      <RunItem item={i}/>
    </List.Item>
  )}
/>):(<span>{item.name}</span>)
}
export default Run;
