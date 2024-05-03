import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, Input, Row, Col, Select, Tree } from 'antd';
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { createSuites, updateSuite } from "./../../../redux/Slice/suitesSlice";
import { onChange } from 'react-toastify/dist/core/store';
import { values } from 'ramda';
import { fetchTestFiltered, testsSelector } from '../../../redux/Slice/testsSlice';
import { foldersSelector } from '../../../redux/Slice/foldersSlice';
import { Hierarchy } from '../../../Lib/helpers';
import { SanitizeTreeData } from '../../../Lib/helperComponents';
import { ExperimentTwoTone } from '@ant-design/icons';
const {DirectoryTree} = Tree
interface CreateModalProps {
  open: boolean;
  handleCancel: () => void,
  suite: any
}

const CreateModal: React.FC<CreateModalProps> = ({ open, handleCancel, suite }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useAppDispatch();
  const { selectedProjects } = useAppSelector(projectsSelector);
  const [form] = Form.useForm()
  const [enableQuery,setEnableQuery] = useState<boolean>(suite.type == "Query"?true:false)
  const [query,setQuery] = useState(suite.id?suite.query:'')
  const { folders } = useAppSelector(foldersSelector);
  const { filteredTests } = useAppSelector(testsSelector);
  const [h, setH] = useState<any>([]) 
  const [treeData,setTreeData] = useState<any[]>([])
  useEffect(()=>{
    setTreeData(GetTreeData(h))
  },[h])
  useEffect(() => {
    const fs = folders.filter((f:any)=>f.containerType=='Test')
    const ts = filteredTests
    var na:any = fs.map((f:any) => ({ ...f, tests: [] }))
    for (const t of ts) {
      const f = na.find((f:any) => f.id == t.folder.id)
      if (f)
        f.tests = [...f.tests, t]
    }
    setH(Hierarchy(na,{tests:ts.filter(t=>t.folder.id==0)}))
}, [filteredTests, folders])
  const GetTreeData=(root:any):any[]=>{
    const data=[]
    if (root.children)
    for(const f of root.children){
      data.push({title:f.name,key:'f-'+f.id,isLeaf:false,children:GetTreeData(f)})
    }
    if(root.tests)
    for(const item of root.tests){
      data.push({title:item.name,key:"t-"+item.id,isLeaf:true,icon:<ExperimentTwoTone/>})
    }
    return SanitizeTreeData(data)
  }
  const onFinish = (values: any) => {
    setConfirmLoading(true);
    setTimeout(() => {
      handleCancel()
      setConfirmLoading(false);
    }, 1000);
    if (selectedProjects)
      if (suite.id) {
        dispatch(updateSuite({ suite: { ...values, id: suite.id } }));
      } else {
        dispatch(createSuites({ suite: values, projectId: selectedProjects?.id }));
      }
  };

  useEffect(() => {
    if (suite && Object.keys(suite).length !== 0) {
      form.setFieldsValue({ id: suite.id, name: suite.name,type: suite.type,query:suite.query, description: suite.description })
    }
  }, [suite]);

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Modal
      title="Create Suite"
      open={open}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
      destroyOnClose
      footer={[
        <Button form="createProjectSuite" key="submit" htmlType="submit" type="primary">
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
            name="createProjectSuite"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            form={form}
            preserve={false}
          >
            <Form.Item
              label="Suite Name"
              name="name"
              rules={[{ required: true, message: 'Please input your suite name!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Suite Description"
              name="description"
              rules={[{ required: true, message: 'Please input your suite description!' },
              { min: 2, message: 'Field must be minimum 2 characters.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Suite Type"
              name="type"
            >
              <Select disabled={suite.id?true:false} onChange={(e)=>{setEnableQuery(e=="Query")}}>
                <Select.Option value={"Container"}>Container</Select.Option>
                <Select.Option value={"Query"}>Query</Select.Option>
              </Select>
            </Form.Item>
            {enableQuery &&<Form.Item
              label="Query"
              name="query"
            >
              <Input.TextArea value={query} onChange={(e)=>setQuery(e.target.value)}/>
              <Button onClick={(e)=>{if(selectedProjects){dispatch(fetchTestFiltered({projectId:selectedProjects.id,searchTerm:query}))}}}>Load</Button>
            </Form.Item>}
          </Form>
          <div style={{maxHeight:'300px',overflow:'scroll'}}><DirectoryTree showLine treeData={treeData}/></div>
          
        </Col>
      </Row>
    </Modal>
  )
}

export default CreateModal
