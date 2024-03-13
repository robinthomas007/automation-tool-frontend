import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Space } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { resourcesSelector, createResourceAction, updateResourceAction } from "./../../../redux/Slice/resourcesSlice";
interface CreateModalProps {
  open: boolean;
  handleCancel: () => void;
  action?: any
}

const CreateActionModal: React.FC<CreateModalProps> = ({ open, handleCancel, action }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm()

  const dispatch = useAppDispatch();
  const { selectedResources } = useAppSelector(resourcesSelector);


  useEffect(() => {
    if (action && Object.keys(action).length !== 0) {
      form.setFieldsValue({ id: action.id, name: action.name, description: action.description })
    }
  }, [action]);

  const onFinish = (values: any) => {
    console.log(values, "Interactions--")
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (action && action.id)
      dispatch(updateResourceAction({ resourceAction: values, resourceId: selectedResources?.id, actionId: action.id }));
    else
      dispatch(createResourceAction({ resourceAction: values, resourceId: selectedResources?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <Modal
      title="Create Interaction"
      open={open}
      width={600}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <Button form="createResourceAction" key="submit" htmlType="submit" type="primary">
          Save
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
      ]}
    >
      <Row justify="start">
        <Col span={24}>
          <Form
            name="createResourceAction"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            preserve={false}
          >

            <Form.Item
              label="Interaction Name"
              name="name"
              rules={[{ required: true, message: 'Please input your Resource Name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Interaction Description"
              name="description"
              rules={[{ required: true, message: 'Please input your Resource Description!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Col>
      </Row>

    </Modal>
  )
}

export default CreateActionModal
