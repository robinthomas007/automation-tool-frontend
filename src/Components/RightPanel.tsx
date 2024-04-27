import React, { useState, useEffect } from 'react';

import {
  InteractionOutlined,
  ExperimentOutlined,
  StepForwardOutlined,
  FormOutlined,
  BarsOutlined,
} from '@ant-design/icons';
import { Layout, Tabs } from 'antd';
import StepsRightPanel from "./../Main/pages/Step/StepsRightPanel";
import ResourcesRightPanel from "./../Main/pages/Resource/ResourceRightPanel";
import SuitesRightPanel from "./../Main/pages/Suite/SuiteRightPanelTreeStyled";
import TestsRightPanelData from './../Main/pages/Test/TestsRightPanelData'
import TestRightPanel from './../Main/pages/Test/TestRightPanelTreeStyled'
import RunsRightPanel from './../Main/pages/Runs/RunsRightPanel'
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
    <Sider collapsible style={{ background: '#fff', paddingTop:'8px',paddingBottom:'8px', paddingRight:collapsed?'0px':'8px', border:'1px solid rgb(229, 231, 235)' }} className='data-root main-right-slider' width={550} reverseArrow>
      <div/>
      <Tabs
        tabPosition={'left'}
        activeKey={activeTabKey}
        onChange={handleTabChange}
        items={tabs.filter(tab => tab.type === type).map((tab, i) => {
          const id = String(i + 1);
          return {
            label: tab.Tab,
            key: id,
            children: <div className='tools-tab'>{tab.Panel}</div>,
          };
        })}
      />
    </Sider>
  )
};

export default RightPanel;
