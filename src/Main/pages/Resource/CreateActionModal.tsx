import React, { useState } from 'react'
import { Button, Modal, Form, Input, Row, Col, Space } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { resourcesSelector, createResourceAction } from "./../../../redux/Slice/resourcesSlice";

import {
  CloseCircleOutlined
} from '@ant-design/icons';

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void
}

const CreateActionModal: React.FC<CreateModalProps> = ({ open, handleCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { selectedResources } = useAppSelector(resourcesSelector);

  const onFinish = (values: any) => {
    console.log(values, "Resource Actions--")
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 2000);
    dispatch(createResourceAction({ resourceAction: values, resourceId: selectedResources?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <Modal
      title="Create Action"
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
            // style={{ maxWidth: 600 }}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            <Form.Item
              label="Action Name"
              name="name"
              rules={[{ required: true, message: 'Please input your Resource Name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Action Description"
              name="description"
              rules={[{ required: true, message: 'Please input your Resource Description!' }]}
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
