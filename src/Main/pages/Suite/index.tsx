import RightPanel from "../../../Components/RightPanel";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Suites from "./Suites";

import { Layout, theme } from 'antd';
const { Content } = Layout;

const Index = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ background: colorBgContainer , height:'100%'}}>
      <DndProvider backend={HTML5Backend}>
        <Content className="data-content">
          <Suites/>
        </Content>
        <RightPanel type="suite" />
      </DndProvider>
    </Layout>
  );
};

export default Index;
