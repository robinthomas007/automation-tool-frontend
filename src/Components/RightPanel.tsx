import React, { useState, useEffect } from 'react';

import {
  RocketOutlined,
  DatabaseOutlined,
  StepForwardOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined
} from '@ant-design/icons';
import { Layout, Tabs } from 'antd';
import Steps from "./../Main/pages/Step/Steps";
import Tests from "./../Main/pages/Test/Tests";
import Resources from "./../Main/pages/Resource/Resources";
import Suites from "./../Main/pages/Suite/Suites";
import TestsRightPanelData from './../Main/pages/Test/TestsRightPanelData'
import DataProfile from './../Main/pages/DataProfile/DataProfile'
import { useAppDispatch, useAppSelector } from "./../redux/hooks";
import { fetchTests, testsSelector, selectTests } from "./../redux/Slice/testsSlice";
import Runs from '../Main/pages/Runs/Runs';

const { Sider } = Layout;

const RightPanel = ({ type }: { type?: string }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('1');

  const { selectedStep } = useAppSelector(testsSelector);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    if (selectedStep && selectedStep.step?.id) {
      setActiveTabKey('2')
    }
  }, [selectedStep])


  const tabs = [
    {
      Tab: <DatabaseOutlined />,
      Panel: <Steps showSelected={false} />,
      type: "step"
    },
    {
      Tab: <StepForwardOutlined />,
      Panel: <Tests showSelected={false} />,
      type: "tests"
    },
    {
      Tab: <DatabaseOutlined />,
      Panel: <TestsRightPanelData />,
      type: "tests"
    },
    {
      Tab: <DatabaseOutlined />,
      Panel: <Resources showSelected={false} />,
      type: "resource"
    },
    {
      Tab: <RocketOutlined />,
      Panel: <Suites showSelected={false} />,
      type: "suite"
    },
    {
      Tab: <RocketOutlined />,
      Panel: <Runs showSelected={false} />,
      type: "run"
    },
    {
      Tab: <RocketOutlined />,
      Panel: <DataProfile showSelected={false} />,
      type: "data_profile"
    },
  ]

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#fff', padding: 30 }} className='main-right-slider'>
      <div className="demo-logo-vertical" />
      {collapsed ? <DoubleLeftOutlined style={{ marginLeft: 22 }} onClick={() => setCollapsed(!collapsed)} /> : <DoubleRightOutlined style={{ marginLeft: 22 }} onClick={() => setCollapsed(!collapsed)} />}
      <Tabs
        tabPosition={'left'}
        activeKey={activeTabKey}
        onChange={handleTabChange}
        items={tabs.filter(tab => tab.type === type).map((tab, i) => {
          const id = String(i + 1);
          return {
            label: tab.Tab,
            key: id,
            children: tab.Panel,
          };
        })}
      />
    </Sider>
  )
};

export default RightPanel;
