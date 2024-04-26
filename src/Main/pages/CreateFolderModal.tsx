import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, TreeSelect } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import { projectsSelector } from "./../../redux/Slice/projectsSlice";
import { createTest, updateTest } from "./../../redux/Slice/testsSlice";
import { createFolder, foldersSelector, updateFolder } from '../../redux/Slice/foldersSlice';
import { Hierarchy } from '../../Lib/helpers';

interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  data: any
}

const CreateFolderModal: React.FC<CreateModalProps> = ({ open, handleCancel, data }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { folders } = useAppSelector(foldersSelector);
  const [treeData,setTreeData] = useState<any>(undefined)
  const [form] = Form.useForm()
  const HToTD=(h:any)=>{
    return h.children?h.children.map((f:any)=>NodeMap(f)):[]
  }
  const NodeMap=(n:any)=>{
    return {
      value:n.id,
      title:n.name,
      children: n.children?n.children.map((f:any)=>NodeMap(f)):[]
    }
  }
  useEffect(()=>{
    const h=Hierarchy(folders.filter((f:any)=>f.containerType=='Test'),{})
    setTreeData(HToTD(h))
  },[selectedProjects])


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
        dispatch(updateFolder({ folder: { ...values, id: data.folder.id,containerType:'Test' } }));
      } else {
        dispatch(createFolder({ folder: {...values,containerType:'Test'},projectId: selectedProjects?.id }));
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
