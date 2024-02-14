import React from 'react'
import { Button, Checkbox, Form, Input, Row, Col, Space } from 'antd';

export default function CreateResource({ next }: any) {

  const onFinish = (values: any) => {
    console.log(values, "valuesvalues")
    next()
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  // type FieldType = {
  //   resourceName?: string;
  //   resourceDescription?: string;
  // };


  return (
    <Row justify="start">
      <Col span={24}>
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

          <Form.List name="Resource" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                <Row justify="start">
                  <Col span={12}>
                    <Form.Item className='form-item-head-btn'>
                      <Button type="dashed" onClick={() => add()} block>
                        Add Resource
                      </Button>
                    </Form.Item>
                  </Col>
                </Row>
                {fields.map(({ key, name, ...restField }, index) => (
                  <>
                    <Row justify="start" key={key} >
                      <Col span={12}>
                        <Form.Item
                          {...restField}
                          label={`Resource Name ${index + 1}`}
                          name={[name, 'resourceName']}
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          label={`Resource Description ${index + 1}`}
                          name={[name, 'resourceDescription']}
                          rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row justify="center">
                      <Col span={12}>
                        <Form.List name={[name, 'events']}>
                          {(fields, { add, remove }) => (
                            <>
                              <Form.Item className='form-item-head-btn'>
                                <Button type="dashed" onClick={() => add()} block>
                                  Add Elements
                                </Button>
                              </Form.Item>
                              {fields.map(({ key, name, ...restField }) => (
                                // <Space key={key} style={{ marginBottom: 8 }} align="baseline">
                                <div>
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'actionName']}
                                    label="Action"
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

                                  <Button type="dashed" onClick={() => remove(name)} style={{ marginLeft: 8 }}>
                                    X
                                  </Button>
                                </div>
                                // </Space>
                              ))}
                            </>
                          )}
                        </Form.List>
                      </Col>
                      <Col span={12}>
                        <Form.List name={[name, 'actions']}>
                          {(fields, { add, remove }) => (
                            <>
                              <Form.Item className='form-item-head-btn'>
                                <Button type="dashed" onClick={() => add()} block>
                                  Add Action
                                </Button>
                              </Form.Item>
                              {fields.map(({ key, name, ...restField }) => (
                                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                  <Form.Item
                                    {...restField}
                                    name={[name, 'actionName']}
                                    label="Action"
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

                                  <Button type="dashed" onClick={() => remove(name)} style={{ marginLeft: 8 }}>
                                    Remove
                                  </Button>
                                </Space>
                              ))}
                            </>
                          )}
                        </Form.List>
                      </Col>
                    </Row>
                    <hr></hr>
                    <br></br>
                  </>
                ))}
              </>)}
          </Form.List>

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