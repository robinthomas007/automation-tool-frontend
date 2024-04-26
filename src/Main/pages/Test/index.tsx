import RightPanel from "../../../Components/RightPanel";
import Tests from "./Tests";
import { Layout, theme } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Content } = Layout;

const Index = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ background: colorBgContainer , height:'100%'}}>
      <DndProvider backend={HTML5Backend}>
        <Content className="data-content">
          <Tests/>
        </Content>
        <RightPanel type="tests" />
      </DndProvider>
    </Layout>
  );
};

export default Index;