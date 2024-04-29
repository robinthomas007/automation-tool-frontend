import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, TreeSelect } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Hierarchy } from '../../../Lib/helpers';
import { foldersSelector } from '../../../redux/Slice/foldersSlice';
import { createStep, updateStep } from '../../../redux/Slice/stepsSlice';
import {
  FolderTwoTone,
} from '@ant-design/icons';
import { HToTD } from '../../../Lib/helperComponents';
import { createResource, updateResource } from '../../../redux/Slice/resourcesSlice';
interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  resource: any
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel, resource }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { folders } = useAppSelector(foldersSelector);
  const [treeData,setTreeData] = useState<any>(undefined)
  const [form] = Form.useForm()
  
  useEffect(()=>{
    const h=Hierarchy(folders.filter((f:any)=>f.containerType=='Resource'),{})
    setTreeData(HToTD(h))
  },[folders])
  useEffect(() => {
    if(resource.folder){
      form.setFieldsValue({ folder_id:resource.folder.id })
    }
    if (resource &&resource.resource && Object.keys(resource.resource).length !== 0) {
      form.setFieldsValue({ id: resource.resource.id, name: resource.resource.name, description: resource.resource.description,type: resource.resource.type,folder_id:resource.folder.id })
    } else {
      form.setFieldsValue({type:'PAGE'})
    }
  }, [resource]);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedProjects)
      if (resource.resource && resource.resource.id) {
        dispatch(updateResource({ resource: values, resourceId: resource.resource.id }));
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
      destroyOnClose
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      footer={[
        <Button form="createProjectObject" key="submit" htmlType="submit" type="primary">
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
            name="createProjectObject"
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
              suffixIcon= {<FolderTwoTone/>}
              treeData={treeData}
              />
            </Form.Item>
            <Form.Item
              label="Object Name"
              name="name"
              rules={[{ required: true, message: 'Please input your object name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Object Description"
              name="description"
              rules={[{ required: true, message: 'Please input your step description!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
                  label="Type"
                  name="type"
                  rules={[{ required: true, message: 'Please input your Type!' },
                  { min: 2, message: 'Resource type must be minimum 2 characters.' }]}
                >
                  <Input disabled/>
                </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

export default CreateModal
