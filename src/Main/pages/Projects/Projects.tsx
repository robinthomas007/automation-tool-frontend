import React, { useState } from 'react'
import { Layout, theme } from 'antd';
import RightPanel from "../../../Components/RightPanel";
import { Space, Table, Row, Col, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {  useAppSelector } from "./../../../redux/hooks";
import {  projectsSelector } from "./../../../redux/Slice/projectsSlice";
import CreateModal from './CreateModal'
import { meSelector } from '../../../redux/Slice/meSlice';

const { Content } = Layout;

export default function Projects() {

  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const { projects } = useAppSelector(projectsSelector);
  const { selectedOrgs } = useAppSelector(meSelector);



  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a href={`/org/${selectedOrgs?.org.domain}/${projects.find(p=>p.name==text)?.id}`}>{text}</a>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Resources',
      dataIndex: 'resources',
      key: 'resources',
      render: (res) => <span>{res?res.length:0}</span>,
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      key: 'steps',
      render: (res) => <span>{res?res.length:0}</span>,
    },
    {
      title: 'Suites',
      dataIndex: 'suites',
      key: 'suites',
      render: (res) => <span>{res?res.length:0}</span>,
    },
    {
      title: 'Tests',
      dataIndex: 'tests',
      key: 'tests',
      render: (res) => <span>{res?res.length:0}</span>,
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  const handleCancel = () => {
    setOpenCreate(false)
  }

  return (
    <Layout style={{ background: colorBgContainer, height:'100%' }}>
      <Content className='data-root'>
        <Row justify={'end'}>
          <Col><Button type="primary" style={{ marginBottom: 10 }} onClick={() => setOpenCreate(true)}>Create Project</Button></Col>
          <CreateModal open={openCreate} handleCancel={handleCancel} />
        </Row>
        <Table className='data' columns={columns} dataSource={projects} />
      </Content>
    </Layout>
  )
}
