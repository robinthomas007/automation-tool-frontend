import React, { useState } from 'react'
import { Button, Modal, Form, Input, Row, Col, Space } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { resourcesSelector, createResourcesElement } from "./../../../redux/Slice/resourcesSlice";
import { createResource } from "./../../../redux/Slice/resourcesSlice";
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import { Card } from 'antd';
const { TextArea } = Input;

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void
}

const CreateActionModal: React.FC<CreateModalProps> = ({ open, handleCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { selectedResources } = useAppSelector(resourcesSelector);

  const onFinish = (values: any) => {
    console.log(values, "Resource Elements--")
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 2000);
    dispatch(createResourcesElement({ resourceElement: values, resourceId: selectedResources?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <Modal
      title="Create Elements"
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
            // style={{ maxWidth: 600 }}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            <Form.Item
              label="Element Name"
              name="name"
              rules={[{ required: true, message: 'Please input your Element Name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Element Locator"
              name="locator"
              rules={[{ required: true, message: 'Please input your Element Locator!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Element type"
              name="type"
              rules={[{ required: true, message: 'Please input your Element type!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Element Description"
              name="description"
              rules={[{ required: true, message: 'Please input your Element Description!' }]}
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
