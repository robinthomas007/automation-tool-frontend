import React, { useState } from 'react'
import { Button, Modal, Form, Input, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { createSuites } from "./../../../redux/Slice/suitesSlice";

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);

  const onFinish = (values: any) => {
    console.log(values, "steps--")
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 2000);
    if(selectedProjects)
    dispatch(createSuites({ suite:values, projectId: selectedProjects?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title="Create Suite"
      open={open}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <Button form="createProjectSuite" key="submit" htmlType="submit" type="primary">
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
            name="createProjectSuite"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Suite Name"
              name="name"
              rules={[{ required: true, message: 'Please input your step name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Suite Description"
              name="description"
              rules={[{ required: true, message: 'Please input your step description!' }]}
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
