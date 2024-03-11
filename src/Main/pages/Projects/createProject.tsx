import React, { useCallback } from 'react'
import { Button, Form, Input, Row, Col } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { createProjects } from "./../../../redux/Slice/projectsSlice";
import { meSelector } from '../../../redux/Slice/meSlice';

export default function CreateProject({ next }: any) {
  const { selectedOrgs } = useAppSelector(meSelector);
  const dispatch = useAppDispatch();
  const onFinish = useCallback((values: any) => {
    if (selectedOrgs !== undefined) {
      dispatch(createProjects({ orgId: selectedOrgs.org.id, data: values }));
      next()
    } else {
      next()
    }
  }, [selectedOrgs]);


  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  type FieldType = {
    projectName?: string;
    projectDescription?: string;
  };


  return (
    <Row justify="start">
      <Col span={12}>
        <Form
          name="basic"
          // style={{ maxWidth: 600 }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="Project Name"
            name="projectName"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Project Description"
            name="projectDescription"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{}}>
            <Button style={{ position: 'absolute', right: 0 }} type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>

  )
}
