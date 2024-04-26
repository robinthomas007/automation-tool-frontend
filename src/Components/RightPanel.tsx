import React, { useState, useEffect } from 'react';

import {
  InteractionOutlined,
  ExperimentOutlined,
  RocketOutlined,
  DatabaseOutlined,
  StepForwardOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FormOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import { Layout, Tabs } from 'antd';
import StepsRightPanel from "./../Main/pages/Step/StepsRightPanel";
import ResourcesRightPanel from "./../Main/pages/Resource/ResourceRightPanel";
import SuitesRightPanel from "./../Main/pages/Suite/SuiteRightPanel";
import TestsRightPanelData from './../Main/pages/Test/TestsRightPanelData'
import TestRightPanel from './../Main/pages/Test/TestRightPanel'
import RunsRightPanel from './../Main/pages/Runs/RunsRightPanel'
import DataProfile from './../Main/pages/DataProfile/DataProfile'
import { useAppSelector } from "./../redux/hooks";
import { testsSelector, } from "./../redux/Slice/testsSlice";
import StepsRightPanelData from '../Main/pages/Step/StepsRightPanelData';
import { stepsSelector } from '../redux/Slice/stepsSlice';
import DataProfileRightPanel from '../Main/pages/DataProfile/DataProfileRightPanel';

const { Sider } = Layout;

const RightPanel = ({ type }: { type?: string }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('1');

  const { selectedStep } = useAppSelector(testsSelector);
  const { selectedResourceAction } = useAppSelector(stepsSelector);

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  useEffect(() => {
    if (selectedStep && selectedStep.step?.id) {
      setActiveTabKey('2')
    }
  }, [selectedStep])

  useEffect(() => {
    if (Object.keys(selectedResourceAction).length !== 0) {
      setActiveTabKey('2')
    } else {
      setActiveTabKey('1')
    }
  }, [selectedResourceAction])


  const tabs = [
    {
      Tab: <InteractionOutlined />,
      Panel: <StepsRightPanel />,
      type: "step"
    },
    {
      Tab: <FormOutlined />,
      Panel: <StepsRightPanelData />,
      type: "step"
    },
    {
      Tab: <StepForwardOutlined />,
      Panel: <TestRightPanel />,
      type: "tests"
    },
    {
      Tab: <FormOutlined />,
      Panel: <TestsRightPanelData />,
      type: "tests"
    },
    {
      Tab: <BarsOutlined />,
      Panel: <ResourcesRightPanel />,
      type: "resource"
    },
    {
      Tab: <ExperimentOutlined />,
      Panel: <SuitesRightPanel />,
      type: "suite"
    },
    {
      Tab: <BarsOutlined />,
      Panel: <RunsRightPanel />,
      type: "run"
    },
    {
      Tab: <BarsOutlined />,
      Panel: <DataProfileRightPanel/>,
      type: "data_profile"
    },
  ]

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#fff', paddingTop:10,paddingBottom:10,paddingLeft: 30,paddingRight: 30, maxHeight:"90vh",
    overflow:"hidden" }} className='main-right-slider'>
      <div/>
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
            children: <div className='data-root'>{tab.Panel}</div>,
          };
        })}
      />
    </Sider>
  )
};

export default RightPanel;
