import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Space, Select } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { resourcesSelector, createResourcesElement, updateResourcesElement } from "./../../../redux/Slice/resourcesSlice";
import {
} from '@ant-design/icons';
const { TextArea } = Input;

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  element: any,
  allowedTypes: string[]
}

const CreateActionModal: React.FC<CreateModalProps> = ({ open, handleCancel, element , allowedTypes}) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { selectedResources } = useAppSelector(resourcesSelector);
  const [form] = Form.useForm()

  useEffect(() => {
    if (element && Object.keys(element).length !== 0) {
      form.setFieldsValue({ id: element.id, name: element.name, description: element.description, locator: element.locator, type: element.type })
    }
  }, [element]);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);

    if (element.id)
      dispatch(updateResourcesElement({ element: { ...values, id: element.id } }));
    else
      dispatch(createResourcesElement({ resourceElement: values, resourceId: selectedResources?.id }));
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  // WebElement

  return (
    <Modal
      title="Create Properties"
      open={open}
      width={600}
      destroyOnClose
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button form="createResourceElement" key="submit" htmlType="submit" type="primary">
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
            name="createResourceElement"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            preserve={false}
            initialValues={{ type: allowedTypes[0] }}
          >

            <Form.Item
              label="Property Name"
              name="name"
              rules={[{ required: true, message: 'Please input your Property Name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Property Locator"
              name="locator"
              rules={[{ required: true, message: 'Please input your Property Locator!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Property type"
              name="type"
              rules={[{ required: true, message: 'Please input your Property type!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Select options={allowedTypes.map((at:string)=>({"label":at,"value":at}))}/>
              {/* <Input value={'WebElement'} disabled /> */}
            </Form.Item>
            <Form.Item
              label="Property Description"
              name="description"
              rules={[{ required: true, message: 'Please input your Property Description!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <TextArea rows={4} placeholder="Description" />

            </Form.Item>
          </Form>
        </Col>
      </Row>

    </Modal>
  )
}

export default CreateActionModal
