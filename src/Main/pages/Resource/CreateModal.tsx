import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Space } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchProjects, projectsSelector, selectProjects } from "./../../../redux/Slice/projectsSlice";
import { createResource, updateResource } from "./../../../redux/Slice/resourcesSlice";
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import { Card } from 'antd';

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void;
  resource?: any
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel, resource }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm()

  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (resource && Object.keys(resource).length !== 0) {
      form.setFieldsValue({ id: resource.id, name: resource.name, description: resource.description, type: resource.type })
    }
  }, [resource]);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedProjects)
      if (resource.id) {
        dispatch(updateResource({ resource: values, resourceId: resource.id }));
      } else {
        dispatch(createResource({ resource: values, projectId: selectedProjects?.id }));
      }

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <Modal
      title="Create Object"
      open={open}
      width={600}
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
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            preserve={false}
          >
            <Row justify="start">
              <Col span={24}>
                <Form.Item
                  label="Object Name"
                  name="name"
                  rules={[{ required: true, message: 'Please input your Resource Name!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Object Description"
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
            {/* <Row justify="center">
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
                            label="Interaction Name"
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
            </Row> */}
          </Form>
        </Col>
      </Row>

    </Modal>
  )
}

export default CreateModal
