import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { createSuites, updateSuite } from "./../../../redux/Slice/suitesSlice";

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  suite: any
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel, suite }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log(values, "steps--")
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedProjects)
      if (suite.id) {
        dispatch(updateSuite({ suite: { ...values, id: suite.id } }));
      } else {
        dispatch(createSuites({ suite: values, projectId: selectedProjects?.id }));
      }
  };

  useEffect(() => {
    if (suite && Object.keys(suite).length !== 0) {
      form.setFieldsValue({ id: suite.id, name: suite.name, description: suite.description })
    }
  }, [suite]);

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
            form={form}
            preserve={false}
          >
            <Form.Item
              label="Suite Name"
              name="name"
              rules={[{ required: true, message: 'Please input your suite name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Suite Description"
              name="description"
              rules={[{ required: true, message: 'Please input your suite description!' },
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

export default CreateModal
