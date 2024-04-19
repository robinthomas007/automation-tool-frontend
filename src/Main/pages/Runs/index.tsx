import { Layout, theme } from 'antd';
import RightPanel from "../../../Components/RightPanel";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Content } from 'antd/es/layout/layout';
import Runs from './Runs';
import { useAppSelector } from '../../../redux/hooks';
import { runsSelector } from '../../../redux/Slice/runsSlice';
export default function Index() {
  const { selectedRunId, runs } = useAppSelector(runsSelector)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (<Layout style={{ background: colorBgContainer , height:'100%'}}>
    <DndProvider backend={HTML5Backend}>
      <Content style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        background: '#fff',
        borderRadius: borderRadiusLG,
      }}>
        <Runs />
      </Content>
      <RightPanel type="run" />
    </DndProvider>
  </Layout>)
}