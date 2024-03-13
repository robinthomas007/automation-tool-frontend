import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { createStep, updateStep } from "./../../../redux/Slice/stepsSlice";

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  step: any
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel, step }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);
  const [form] = Form.useForm()

  useEffect(() => {
    if (step && Object.keys(step).length !== 0) {
      form.setFieldsValue({ id: step.id, name: step.name, description: step.description })
    }
  }, [step]);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedProjects)
      if (step.id) {
        dispatch(updateStep({ step: { ...values, id: step.id } }));
      } else {
        dispatch(createStep({ step: values, projectId: selectedProjects?.id }));
      }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title="Create Step"
      open={open}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose
      width={600}
      footer={[
        <Button form="createProjectStep" key="submit" htmlType="submit" type="primary">
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
            name="createProjectStep"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            preserve={false}
          >
            <Form.Item
              label="Step Name"
              name="name"
              rules={[{ required: true, message: 'Please input your step name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Step Description"
              name="description"
              rules={[{ required: true, message: 'Please input your step description!' },
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
