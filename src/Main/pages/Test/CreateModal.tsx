import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, TreeSelect } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { createTest, updateTest } from "./../../../redux/Slice/testsSlice";
import { Hierarchy } from '../../../Lib/helpers';
import { foldersSelector } from '../../../redux/Slice/foldersSlice';
import { HToTD } from '../../../Lib/helperComponents';
import {
  FolderTwoTone,
} from '@ant-design/icons';
interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  test: any
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel, test }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { folders } = useAppSelector(foldersSelector);
  const [treeData,setTreeData] = useState<any>(undefined)
  const [form] = Form.useForm()
  
  useEffect(()=>{
    const h=Hierarchy(folders.filter((f:any)=>f.containerType=='Test'),{})
    setTreeData(HToTD(h))
  },[folders])
  useEffect(() => {
    if(test.folder){
      form.setFieldsValue({ folder_id:test.folder.id })
    }
    if (test &&test.test && Object.keys(test.test).length !== 0) {
      form.setFieldsValue({ id: test.test.id, name: test.test.name, description: test.test.description,lock: test.test.lock,folder_id:test.folder.id })
    }
  }, [test]);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedProjects)
      if (test.test && test.test.id) {
        dispatch(updateTest({ test: { ...values, id: test.test.id } }));
      } else {
        dispatch(createTest({ test: values, projectId: selectedProjects?.id }));
      }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  
  return (
    <Modal
      title="Create Test"
      open={open}
      destroyOnClose
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button form="createProjectTest" key="submit" htmlType="submit" type="primary">
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
            name="createProjectTest"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            preserve={false}
          >
            <Form.Item
              label="Folder"
              name="folder_id"
            >
              <TreeSelect
              treeLine={true}
              treeData={treeData}
              suffixIcon= {<FolderTwoTone/>}
              />
            </Form.Item>
            <Form.Item
              label="Test Name"
              name="name"
              rules={[{ required: true, message: 'Please input your test name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Test Description"
              name="description"
              rules={[{ required: true, message: 'Please input your test description!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Lock"
              name="lock"
              rules={[{ required: false },
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
