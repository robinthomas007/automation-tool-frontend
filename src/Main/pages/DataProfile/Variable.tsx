import { Row, Col, List, Button, Input, Form } from 'antd';
import { useDrop } from 'react-dnd';
import { useAppDispatch } from "./../../../redux/hooks";
import { addVariableToProfile, createProfileVariable, RemoveVariable } from "./../../../redux/Slice/dataProfileSlice";
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

const Variable = ({ variables, profileId }: { variables: any, profileId: number }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [, drop] = useDrop({
    accept: 'VARIABLE_TO_PROFILE',
    drop: (item) => {
      dispatch(addVariableToProfile({ item }));
    }
  });

  const onFinish = (values: any) => {
    const { variables } = values;
    const formattedVariables = variables.map((item: any) => {
      const [key, value] = Object.entries(item)[0];
      const variable_id = parseInt(key.split('_')[1]);
      return {
        variable_id: variable_id,
        value: value
      };
    });
    dispatch(createProfileVariable({ variables: { variables: formattedVariables }, profileId }));

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleRemoveVariable = ({ id }: { id: number }) => {
    dispatch(RemoveVariable({ id }));
  };

  return (
    <Row ref={drop}>
      <Col span={24}>
        <Form
          name="createProfileVariable"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          labelAlign="right"
          form={form}
        >
          <List
            header={<div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Variables</span>
              <Button
                form="createProfileVariable" key="submit" htmlType="submit" type='primary'>Save</Button></div>}
            bordered
            dataSource={variables ? variables : []}
            renderItem={(item: any, index) => (
              <List.Item className="variable-item">
                <Form.Item
                  className="w-full"
                  label={item.variable.name}
                  name={['variables', index, `variable_${item.variable.id}`]}
                  rules={[{ required: true, message: 'Please input the variable value!' }]}
                  initialValue={item.value ? item.value : ''}
                >
                  <Input placeholder="Variable Value" style={{ width: '100%' }} />
                </Form.Item>
                <CloseCircleOutlined className="close-icon" onClick={() => handleRemoveVariable({ id: item.id })} style={{ marginLeft: 10 }} />

              </List.Item>
            )}
          />
        </Form>
      </Col>
    </Row>
  );
};

export default Variable;
