import React, { useState } from 'react'
import { Button, Modal, Form, Input, Row, Col, Space } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchProjects, projectsSelector, selectProjects } from "./../../../redux/Slice/projectsSlice";
import { createResource } from "./../../../redux/Slice/resourcesSlice";
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import { Card } from 'antd';

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);

  const onFinish = (values: any) => {
    console.log(values, "Resource--")
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 2000);
    if(selectedProjects)
      dispatch(createResource({ resource:values, projectId: selectedProjects?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <Modal
      title="Create Resource"
      open={open}
      width={1000}
      destroyOnClose
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button form="createResource" key="submit" htmlType="submit" type="primary">
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
            name="createResource"
            // style={{ maxWidth: 600 }}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row justify="start">
              <Col span={12}>
                <Form.Item
                  label="Resource Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input your Resource Name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Resource Description"
                  name="description"
                  rules={[{ required: true, message: 'Please input your Resource Description!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Type"
                  name="type"
                  rules={[{ required: true, message: 'Please input your Type!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={12}>
                <Form.List name="elements">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item className='form-item-head-btn' label=" " colon={false}>
                        <Button type="dashed" onClick={() => add()} block>
                          Add Elements
                        </Button>
                      </Form.Item>
                      {fields.map(({ key, name, ...restField }) => (

                        <Card style={{ position: 'relative', margin: 10, background: '#f5f5f5' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="Element Name"
                            rules={[{ required: true, message: 'Please input element name!' }]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            label="Description"
                            rules={[{ required: true, message: 'Please input description!' }]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label="Type"
                            rules={[{ required: true, message: 'Please input Type!' }]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'locator']}
                            label="Locator"
                            rules={[{ required: true, message: 'Please input Locator!' }]}
                          >
                            <Input />
                          </Form.Item>

                          <CloseCircleOutlined onClick={() => remove(name)} style={{ position: 'absolute', top: 6, right: 6 }} />
                        </Card>

                      ))}
                    </>
                  )}
                </Form.List>
              </Col>
              <Col span={12}>
                <Form.List name="actions">
                  {(fields, { add, remove }) => (
                    <>
                      <Form.Item className='form-item-head-btn' style={{ textAlign: 'right' }} label=" " colon={false}>
                        <Button type="dashed" onClick={() => add()} block>
                          Add Action
                        </Button>
                      </Form.Item>
                      {fields.map(({ key, name, ...restField }) => (
                        <Card style={{ position: 'relative', margin: 10, background: '#f5f5f5' }}>
                          <Form.Item
                            {...restField}
                            name={[name, 'name']}
                            label="Action Name"
                            rules={[{ required: true, message: 'Please input action name!' }]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            label="Description"
                            rules={[{ required: true, message: 'Please input description!' }]}
                          >
                            <Input />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            name={[name, 'type']}
                            label="Type"
                            rules={[{ required: true, message: 'Please input Type!' }]}
                          >
                            <Input />
                          </Form.Item>

                          <CloseCircleOutlined onClick={() => remove(name)} style={{ position: 'absolute', top: 6, right: 6 }} />
                        </Card>
                      ))}
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

    </Modal>
  )
}

export default CreateModal
