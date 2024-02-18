import { RunDataItem, Run as RunModel } from "../../../redux/Slice/runsSlice";
import { Row, Col, List } from 'antd';
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
/>):(<div><span>{item.name}</span>{item.screenshot&& item.screenshot.length>0 && <img src={item.screenshot}/>}</div>)
}
export default Run;
