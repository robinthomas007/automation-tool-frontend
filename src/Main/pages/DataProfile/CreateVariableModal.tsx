import React, { useState } from 'react'
import { Button, Modal, Form, Input, Row, Col, Select } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { createVariable } from "./../../../redux/Slice/dataProfileSlice";

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void
}

const { Option } = Select;

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    dispatch(createVariable({ values, project_id: selectedProjects?.id }));

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title="Create Variable"
      open={open}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <Button form="createVariable" key="submit" htmlType="submit" type="primary">
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
            name="createVariable"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Variable Name"
              name="name"
              rules={[{ required: true, message: 'Please input your profile name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="data_type" label="Data Type" rules={[{ required: true }]}>
              <Select
                placeholder="Select a Data Type"
                onChange={() => { }}
                allowClear
              >
                <Option value="string">String</Option>
                <Option value="integer">Integer</Option>
                <Option value="boolean">Boolean</Option>
              </Select>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default CreateModal
