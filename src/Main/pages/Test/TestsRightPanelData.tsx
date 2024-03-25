import React, { useEffect, useState } from 'react'
import { Row, Col, Form } from 'antd';
import { List, Input, Button } from 'antd';
import { HolderOutlined, PlusCircleTwoTone } from '@ant-design/icons';
import { useDrag } from 'react-dnd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { testsSelector, saveTestStepData } from "./../../../redux/Slice/testsSlice";

const TestsRightPanelData = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>([])

  const { selectedStep, selectedTests } = useAppSelector(testsSelector);
  useEffect(() => {
    setData(selectedStep?.data ? selectedStep?.data : [])
  }, [selectedStep])
  const onFinish = (values: any) => {
    const stepIndex = selectedTests.steps.findIndex((step: any) => step.step_id == selectedStep.step_id && step.sequence_number === selectedStep.sequence_number);
    const updatedSteps = [...selectedTests.steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      data: Object.entries(values).map(([name, expression]) => ({ name, expression }))
    }
    dispatch(saveTestStepData({ steps: updatedSteps, testId: selectedTests?.id }))
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <Form
          name="actiondata"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          preserve={false}
        >
          <List
            header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Steps Actions Data</span>
            </div>}
            footer={<div style={{ textAlign: 'right' }}><Button disabled={data.length === 0} form="actiondata" key="submit" htmlType="submit" type='primary'> Save</Button></div>}
            bordered
            dataSource={data}
            renderItem={(item: any, index: number) => (
              <List.Item style={{ padding: 0, width: '100%' }} key={`${item.name}-${item.expression}`}>
                <div style={{ padding: 10, width: '100%' }}>
                  <Form.Item
                    label={item.name}
                    name={item.name}
                    rules={[{ required: true, message: `Please input your ${item.label}!` }]}
                    initialValue={item.expression}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </List.Item>
            )}
          />
        </Form>
      </Col>
    </Row>
  )
}
export default TestsRightPanelData
