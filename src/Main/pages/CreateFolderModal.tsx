import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, TreeSelect } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { projectsSelector } from "./../../redux/Slice/projectsSlice";
import { createFolder, foldersSelector, updateFolder } from '../../redux/Slice/foldersSlice';
import { Hierarchy } from '../../Lib/helpers';
import {
  FolderTwoTone,
} from '@ant-design/icons';
import { HToTD } from '../../Lib/helperComponents';
interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  data: any,
  containerType: string
}
const CreateFolderModal: React.FC<CreateModalProps> = ({ open, handleCancel, data,containerType }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { folders } = useAppSelector(foldersSelector);
  const [treeData,setTreeData] = useState<any>(undefined)
  const [form] = Form.useForm()
  
  useEffect(()=>{
    const h=Hierarchy(folders.filter((f:any)=>f.containerType==containerType),{})
    setTreeData(HToTD(h))
  },[folders,containerType])


  useEffect(() => {
    if(data.parent){
      form.setFieldsValue({ parent_id:data.parent.id })
    }
    if (data &&data.folder && Object.keys(data.folder).length !== 0) {
      form.setFieldsValue({ id: data.folder.id, name: data.folder.name, parent_id:data.parent.id })
    }
  }, [data]);

  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedProjects)
      if (data.folder && data.folder.id) {
        dispatch(updateFolder({ folder: { ...values, id: data.folder.id,containerType} }));
      } else {
        dispatch(createFolder({ folder: {...values,containerType},projectId: selectedProjects?.id }));
      }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Modal
      title="Create Folder"
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
              label="Parent"
              name="parent_id"
            >
              <TreeSelect
              treeLine={true}
              suffixIcon= {<FolderTwoTone/>}
              treeData={treeData}
              />
            </Form.Item>
            <Form.Item
              label="Folder Name"
              name="name"
              rules={[{ required: true, message: 'Please input your test name!' },
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

export default CreateFolderModal
