import RightPanel from "../../../Components/RightPanel";
import Steps from "./APIKeys";
import { Layout, theme } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import APIKeys from "./APIKeys";

const { Content } = Layout;

const Index = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ background: colorBgContainer , height:'100%'}}>
      <DndProvider backend={HTML5Backend}>
        <Content style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
          background: '#fff',
          borderRadius: borderRadiusLG,
        }}>
          <APIKeys/>
        </Content>
      </DndProvider>
    </Layout>
  );
};

export default Index;
