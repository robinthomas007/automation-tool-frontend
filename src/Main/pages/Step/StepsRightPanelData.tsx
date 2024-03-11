import React, { useEffect, useState } from 'react'
import { Row, Col, Form } from 'antd';
import { List, Input, Button } from 'antd';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { saveStepActionData, stepsSelector } from '../../../redux/Slice/stepsSlice';
import { SaveStepActionData } from '../../../redux/Services/steps';

const StepsRightPanelData = () => {
  const dispatch = useAppDispatch();
  const [data,setData] = useState<any[]>([])

  const { selectedSteps,selectedResourceAction  } = useAppSelector(stepsSelector);
  useEffect(()=>{
    setData(selectedResourceAction?.data ? selectedResourceAction?.data : [])
  },[selectedResourceAction])
  const onFinish = (values: any) => {
    const raIndex = selectedSteps.resource_actions.findIndex((ra: any) => ra.resource_action_id==selectedResourceAction.resource_action_id && ra.sequence_number === selectedResourceAction.sequence_number);
    console.log(raIndex,"RA Index")
    const updatedActions = [...selectedSteps.resource_actions];
    updatedActions[raIndex] = {
      ...updatedActions[raIndex],
      data: Object.entries(values).map(([name, expression]) => ({ name, expression }))
    }
    dispatch(saveStepActionData({ actions: updatedActions, stepId: selectedSteps?.id }))
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <Form
          name="interactiondata"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          preserve={false}
        >
          <List
            header={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Interactions Data</span>
            </div>}
            footer={<div style={{ textAlign: 'right' }}><Button form="interactiondata" key="submit" htmlType="submit" type='primary'> Save</Button></div>}
            bordered
            dataSource={data}
            renderItem={(item: any, index: number) => (
              <List.Item style={{ padding: 0, width: '100%' }} key={`${item.name}-${item.expression}`}>
                <div style={{ padding: 10, width: '100%' }}>
                  <Form.Item
                    label={item.name}
                    name={item.name}
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
export default StepsRightPanelData
