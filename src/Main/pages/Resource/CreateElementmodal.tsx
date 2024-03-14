import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Space } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { resourcesSelector, createResourcesElement, updateResourcesElement } from "./../../../redux/Slice/resourcesSlice";
import {
} from '@ant-design/icons';
const { TextArea } = Input;

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  element: any
}

const CreateActionModal: React.FC<CreateModalProps> = ({ open, handleCancel, element }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { selectedResources } = useAppSelector(resourcesSelector);
  const [form] = Form.useForm()

  useEffect(() => {
    if (element && Object.keys(element).length !== 0) {
      form.setFieldsValue({ id: element.id, name: element.name, description: element.description, locator: element.locator, type: element.type })
    }
  }, [element]);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);

    if (element.id)
      dispatch(updateResourcesElement({ element: { ...values, id: element.id } }));
    else
      dispatch(createResourcesElement({ resourceElement: values, resourceId: selectedResources?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // WebElement

  return (
    <Modal
      title="Create Properties"
      open={open}
      width={600}
      destroyOnClose
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button form="createResourceElement" key="submit" htmlType="submit" type="primary">
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
            name="createResourceElement"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            preserve={false}
            initialValues={{ type: 'WebElement' }}
          >

            <Form.Item
              label="Element Name"
              name="name"
              rules={[{ required: true, message: 'Please input your Element Name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Element Locator"
              name="locator"
              rules={[{ required: true, message: 'Please input your Element Locator!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Element type"
              name="type"
              rules={[{ required: true, message: 'Please input your Element type!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input value={'WebElement'} disabled />
            </Form.Item>
            <Form.Item
              label="Element Description"
              name="description"
              rules={[{ required: true, message: 'Please input your Element Description!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <TextArea rows={4} placeholder="Description" />

            </Form.Item>
          </Form>
        </Col>
      </Row>

    </Modal>
  )
}

export default CreateActionModal
