import { Row, Col, List, Button, Input, Form } from 'antd';
import { useDrop } from 'react-dnd';
import { useAppDispatch } from "./../../../redux/hooks";
import { addVariableToProfile, createProfileVariable } from "./../../../redux/Slice/dataProfileSlice";
import {
  HolderOutlined,
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';

const Variable = ({ variables, profileId }: { variables: any, profileId: number }) => {
  const dispatch = useAppDispatch();

  const [, drop] = useDrop({
    accept: 'VARIABLE_TO_PROFILE',
    drop: (item) => {
      dispatch(addVariableToProfile({ item }));
    }
  });

  const onFinish = (values: any) => {
    const { variables } = values;
    console.log(variables, "variablesvariables", values)
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


  return (
    <Row ref={drop}>
      <Col span={24}>
        <Form
          name="createProfileVariable"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <List
            header={<div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Variables</span>
              <Button form="createProfileVariable" key="submit" htmlType="submit" type='primary'>Save</Button></div>}
            bordered
            dataSource={variables ? variables : []}
            renderItem={(item: any, index) => (
              <List.Item>
                <Form.Item
                  label={item.variable.name}
                  name={['variables', index, `variable_${item.variable.id}`]} // Ensure the name follows the correct structure
                  rules={[{ required: true, message: 'Please input the variable value!' }]}
                  initialValue={item.value ? item.value : ''}
                >
                  <Input placeholder="Variable Value" />
                </Form.Item>
              </List.Item>
            )}
          />
        </Form>
      </Col>
    </Row>
  );
};

export default Variable;
