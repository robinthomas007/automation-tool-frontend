import RightPanel from "../../../Components/RightPanel";
import Resources from "./Resources";
import { Layout, theme } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const { Content } = Layout;

const Index = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ background: colorBgContainer }}>
      <DndProvider backend={HTML5Backend}>
        <Content className="data-content">
          <Resources/>
        </Content>
        <RightPanel type="resource" />
      </DndProvider>
    </Layout>
  );
};

export default Index;
