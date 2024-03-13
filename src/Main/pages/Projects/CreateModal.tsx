import React, { useCallback, useState } from 'react'
import { Button, Modal, Form, Input, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { createProjects } from "./../../../redux/Slice/projectsSlice";
import { meSelector } from "./../../../redux/Slice/meSlice";

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { selectedOrgs } = useAppSelector(meSelector);
  const dispatch = useAppDispatch();


  const onFinish = useCallback((values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedOrgs !== undefined) {
      dispatch(createProjects({ orgId: selectedOrgs.org.id, data: values }));
    }
  }, [selectedOrgs]);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <Modal
      title="Create Project"
      open={open}
      // onOk={handleOk}
      destroyOnClose
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button form="createProject" key="submit" htmlType="submit" type="primary">
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
            name="createProject"
            // style={{ maxWidth: 600 }}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Project Name"
              name="name"
              rules={[{ required: true, message: 'Please input your project name!' },
              { min: 2, message: 'project name must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Project Description"
              name="description"
              rules={[{ required: true, message: 'Please input your project description!' },
              { min: 2, message: 'project description must be minimum 2 characters.' }]}
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
