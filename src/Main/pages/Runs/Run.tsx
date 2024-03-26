import { RunDataItem, Run as RunModel } from "../../../redux/Slice/runsSlice";
import { Row, Col, List, Typography } from 'antd';
import { CheckCircleFilled, CloseCircleFilled,ClockCircleOutlined,QuestionCircleOutlined, LoadingOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Tree } from 'antd';

const { Title } = Typography
const Icon = ({status}:{status:string})=>{
  switch(status){
    case 'PASS':
      return <CheckCircleFilled style={{ color: 'green' }} />
    case 'FAIL':
      return <CloseCircleFilled style={{ color: 'red' }} />
    case 'SKIPPED':
      return <MinusCircleOutlined style={{ color: 'grey' }} /> 
    case 'IN_PROGRESS':
      return <LoadingOutlined style={{ color: 'blue' }} />
    case 'SCHEDULED':
      return <ClockCircleOutlined style={{ color: 'blue' }} />
    default:
      return <QuestionCircleOutlined style={{ color: 'red' }} />
  }
}
const Run = ({ run }: { run: RunModel }) => {
  const constructTreeNodes = (data: any, parentKey: string) => {
    if (!data) {
      return null
    }
    return data.items.map((item: any, index: any) => ({
      title: (
        <span>
          <span>{item.error !== "" && item.type === 'ResourceElementAction' ? "Expected:" : ""}{item.name}{item.error !== "" && item.type === 'ResourceElementAction' ? ", Actual: " + item.error : ""} ({item.time}) </span>
          {item.screenshot && <span style={{ display: 'block', padding: 10 }}>
            <img src={item.screenshot} alt="Screenshot" style={{ maxWidth: '100%', marginTop: 10, marginBottom: 10, border: '1px solid #ddd' }} />
          </span>}
        </span>
      ),
      key: `${parentKey}-${item.type}-${item.id}-${index}`,
      icon: <Icon status={item.status}/>,
      children: item.items.length > 0 ? constructTreeNodes(item, `${parentKey}-${item.type}-${item.id}-${index}`) : null,
    }));
  };

  const newTreeData = run?.result ? constructTreeNodes(run?.result, '') : constructTreeNodes(null, '')

  const updatedTreeData = newTreeData && newTreeData.map((node: any, index: any) => {
    if (newTreeData[index]) {
      return {
        ...node,
        children: newTreeData[index].children,
      };
    }
    return node;
  });

  return (
    <Row>
      <Col span={24}>
        <Title level={2}><Icon status={run.result.status}/> {`${run?.result?.name}(${run?.result.time})`}</Title>
        {run && <RunItem item={run.result} treeData={updatedTreeData} />}
      </Col>
    </Row>
  );
};

const RunItem = ({ item, treeData }: { item: RunDataItem, treeData: any }) => {
  const onSelect = (selectedKeys: React.Key[], info: any) => {
  };

  return <div>
    <Tree
      showLine={true}
      showIcon={true}
      defaultExpandAll={true}
      onSelect={onSelect}
      treeData={treeData}
      style={{ padding: '10px' }}
    />
  </div>
}

export default Run;
