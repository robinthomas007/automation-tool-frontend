import React, { useState } from 'react'
import { Button, Modal, Form, Input, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { createTest } from "./../../../redux/Slice/testsSlice";

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);

  const onFinish = (values: any) => {
    console.log(values, "test--")
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 2000);
    if(selectedProjects)
      dispatch(createTest({test:values,projectId: selectedProjects?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title="Create Test"
      open={open}
      destroyOnClose
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button form="createProjectTest" key="submit" htmlType="submit" type="primary">
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
            name="createProjectTest"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Test Name"
              name="name"
              rules={[{ required: true, message: 'Please input your test name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Test Description"
              name="description"
              rules={[{ required: true, message: 'Please input your test description!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default CreateModal
