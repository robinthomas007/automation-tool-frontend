
import React, { useState, useEffect, useCallback } from 'react';
import {
  MenuUnfoldOutlined,
  HomeOutlined,
  ExperimentOutlined,
  RocketOutlined,
  KeyOutlined,
  StepForwardOutlined,
  UserOutlined,
  FileOutlined,
  DatabaseOutlined,
  ContainerOutlined,
} from '@ant-design/icons';
import { Outlet, Link, useParams } from "react-router-dom";
import { Layout, Menu, theme, Popover, Button, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { projectsSelector, selectProjects } from "../redux/Slice/projectsSlice";
import { meSelector } from "../redux/Slice/meSlice";
import { useAuth } from '../Context/authContext'
import './main.css'
import { useNavigate } from "react-router-dom";
import { fetchFolders } from '../redux/Slice/foldersSlice';

const { Header, Sider, Content } = Layout;
const { Title } = Typography

const ProjectsLayout: React.FC = () => {
  const { id } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const navigate = useNavigate();


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useAppDispatch();

  const { projects, selectedProjects } = useAppSelector(projectsSelector);
  const { selectedOrgs } = useAppSelector(meSelector);
  useEffect(() => {
    const iid = parseInt(id ? id : '')
    if (iid > 0 && projects.find(p => p.id == iid))
      dispatch(selectProjects(projects.find(p => p.id == iid)))
    else {
      dispatch(selectProjects(projects[0]))
    }
  }, [projects, id])
  const navigation = useCallback(() => [
    { label: selectedProjects?.name, href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/`, icon: <HomeOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/` },
    { label: "Suites", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/suites`, icon: <RocketOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/suites` },
    { label: "Tests", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/tests`, icon: <ExperimentOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/tests` },
    { label: "Steps", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/steps`, icon: <StepForwardOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/steps` },
    { label: "Objects", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/resources`, icon: <ContainerOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/resources` },
    { label: "Runs", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/runs`, icon: <MenuUnfoldOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/runs`, },
    { label: "Data Profiles", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/data_profiles`, icon: <DatabaseOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/data_profiles`, },
    { label: "Users", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/users`, icon: <UserOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/users`, },
    { label: "API Keys", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/keys`, icon: <KeyOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/keys`, },
    { label: "Files", href: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/files`, icon: <FileOutlined />, key: `/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/files`, },
  ], [selectedProjects]);

  const auth = useAuth()

  useEffect(() => {
    if (auth?.user && !auth.user.perm) {
      navigate(`/`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])
  useEffect(()=>{
    if (selectedProjects){
      dispatch(fetchFolders({projectId:selectedProjects.id,searchTerm:''}))
    }
  },[selectedProjects])
  return (
    <Layout style={{maxHeight:"calc(100vh-70px)",overflow:'hidden'}}>
      <Sider collapsible collapsed={collapsed} style={{ background: '#fff' }} onCollapse={(e)=>{setCollapsed(!collapsed)}}>
        <Menu
          theme="light"
          mode="inline"
        >
          {navigation().map(({ label, href, icon, key }) => (
            <Menu.Item key={key} icon={icon} >
              <Link to={href}>{label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
}

export default ProjectsLayout;
