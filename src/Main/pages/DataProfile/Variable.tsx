import { Row, Col, List, Button, Input, Form } from 'antd';
import { useDrop } from 'react-dnd';
import { useAppDispatch } from "./../../../redux/hooks";
import { addVariableToProfile, createProfileVariable, RemoveVariable } from "./../../../redux/Slice/dataProfileSlice";
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import { useCallback, useEffect } from 'react';

const Variable = ({ profile }: { profile:any }) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [, drop] = useDrop({
    accept: 'VARIABLE_TO_PROFILE',
    drop: (item) => {
      dispatch(addVariableToProfile({ item }));
    }
  });

  useEffect(()=>{
    console.log(profile)
  },[profile])
  const onFinish = useCallback((values: any) => {
    const formattedVariables = Object.entries(values).map((item: any) => {
      const [key, value] = item;
      const variable_id = parseInt(key.split('_')[1]);
      return {
        variable_id: variable_id,
        value: value
      };
    });
    dispatch(createProfileVariable({ variables: { variables: formattedVariables }, profileId:profile.id }));

  },[profile]);

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
          name={"createProfileVariable"+profile.id}
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
                form={"createProfileVariable"+profile.id} key="submit" htmlType="submit" type='primary'>Save</Button></div>}
            bordered
            dataSource={profile.variables ? profile.variables : []}
            renderItem={(item: any, index) => (
              <List.Item className="variable-item">
                <Form.Item
                  className="w-full"
                  label={item.variable.name}
                  name={`variable_${item.variable.id}`}
                  rules={[{ required: true, message: 'Please input the variable value!' }]}
                  initialValue={item.value ? item.value : ''}
                >
                  <Input placeholder="Variable Value" style={{ width: '100%' }} type={item.variable.data_type=='secret'?'password':'text'}/>
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
