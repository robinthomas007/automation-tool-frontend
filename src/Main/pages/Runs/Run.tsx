import { RunDataItem, Run as RunModel } from "../../../redux/Slice/runsSlice";
import { Row, Col, List, Typography } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Tree } from 'antd';

const { Title } = Typography

const Run = ({ run }: { run: RunModel }) => {
  const constructTreeNodes = (data: any, parentKey: string) => {
    return data.items.map((item: any, index: any) => ({
      title: (
        <span>
          <span>{item.error != "" && item.type == 'ResourceElementAction' ? "Expected:" : ""}{item.name}{item.error != "" && item.type == 'ResourceElementAction' ? ", Actual: " + item.error : ""} ({item.time}) </span>
          {item.screenshot && <span style={{ display: 'block', padding: 10 }}>
            <img src={item.screenshot} alt="Screenshot" style={{ maxWidth: '100%', marginTop: 10, marginBottom: 10, border: '1px solid #ddd' }} />
          </span>}
        </span>
      ),
      key: `${parentKey}-${item.type}-${item.id}-${index}`,
      icon: item.status === 'PASS' ? <CheckCircleFilled style={{ color: 'green' }} /> : item.status === 'FAIL' ? <CloseCircleFilled style={{ color: 'red' }} /> : item.status === 'SKIPPED' ? <MinusCircleOutlined style={{ color: 'grey' }} /> : <LoadingOutlined style={{ color: 'blue' }} />,
      children: item.items.length > 0 ? constructTreeNodes(item, `${parentKey}-${item.type}-${item.id}-${index}`) : null,
    }));
  };

  const newTreeData = constructTreeNodes(run.result, '');

  const updatedTreeData = newTreeData.map((node: any, index: any) => {
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
        <Title level={2}><CheckCircleFilled style={{ color: 'green' }} /> {`${run.result?.name}(${run.result.time})`}</Title>
        <RunItem item={run.result} treeData={updatedTreeData} />
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
