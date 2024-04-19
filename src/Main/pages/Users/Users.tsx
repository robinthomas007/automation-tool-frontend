import { useState } from "react"
import { Layout, theme, Card } from 'antd';
import ProjectUsers from "./ProjectUsers";

const { Content } = Layout;

export default function Users() {

  const [activeTabKey, setActiveTabKey] = useState<string>('project_users');

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const tabListNoTitle = [
    {
      key: 'project_users',
      label: 'Project Users',
    },
  ];


  const onTab2Change = (key: string) => {
    setActiveTabKey(key);
  };

  const contentListNoTitle: Record<string, React.ReactNode> = {
    project_users: <ProjectUsers />,
  };

  return (
    <Layout style={{ background: colorBgContainer , height:'100%'}}>
      <Content style={{
        margin: '24px 16px',
        padding: 24,
        minHeight: 280,
        background: '#fff',
        borderRadius: borderRadiusLG,
      }}>
        <Card
          style={{ width: '100%' }}
          tabList={tabListNoTitle}
          activeTabKey={activeTabKey}
          onTabChange={onTab2Change}
          tabProps={{
            size: 'middle',
          }}
        >
          {contentListNoTitle[activeTabKey]}
        </Card>
      </Content>
    </Layout>
  )
}