
import React, { useState, useEffect, useCallback } from 'react';
import {
  MenuUnfoldOutlined,
  HomeOutlined,
  ExperimentOutlined,
  RocketOutlined,
  DatabaseOutlined,
  StepForwardOutlined,
  ProjectOutlined
} from '@ant-design/icons';
import { Outlet, Link, useParams } from "react-router-dom";
import { Layout, Menu, theme, Popover, Button } from 'antd';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProjects, projectsSelector, selectProjects } from "../redux/Slice/projectsSlice";
import { fetchMe, meSelector } from "../redux/Slice/meSlice";
import { useLocation } from 'react-router-dom';
import { Select } from 'antd';
import { useAuth } from './../Context/authContext'
import './main.css'
import Logo from './../Images/logo.svg'
import { clearCookie } from './../Lib/auth'
import CreateModal from './pages/Projects/CreateModal';
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const { id } = useParams();
  const location = useLocation();
  const [pathName, setPathName] = useState("") ;
  useEffect(() => {
    if(location) {
        let tmp = location.pathname.slice(location.pathname.lastIndexOf("/") , location.pathname.length) ;
        setPathName(tmp) ;
    }
}, [location])
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const navigate = useNavigate();
  
  const handleCancel = () => {
    setOpenCreate(false)
  }
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useAppDispatch();

  const { projects, selectedProjects } = useAppSelector(projectsSelector);
  useEffect(()=>{
    const iid = parseInt(id?id:'')
    console.log(iid)
    if(iid>0)
      dispatch(selectProjects(projects.find(p=>p.id==iid)))
    else {
      dispatch(selectProjects(projects[0]))
    }
  },[projects,id])
  const navigation = useCallback(()=>[
    { label: "Dashboard", href: `/project/${selectedProjects?.id}/`, icon: <HomeOutlined />, key: '1', },
    { label: "Suites", href: `/project/${selectedProjects?.id}/suites`, icon: <RocketOutlined />, key: '3', },
    { label: "Tests", href: `/project/${selectedProjects?.id}/tests`, icon: <ExperimentOutlined />, key: '4', },
    { label: "Steps", href: `/project/${selectedProjects?.id}/steps`, icon: <StepForwardOutlined />, key: '5', },
    { label: "Resources", href: `/project/${selectedProjects?.id}/resources`, icon: <DatabaseOutlined />, key: '6', },
    { label: "Runs", href: `/project/${selectedProjects?.id}/runs`, icon: <MenuUnfoldOutlined />, key: '7', },
    { label: "Data Profiles", href: `/project/${selectedProjects?.id}/data_profiles`, icon: <MenuUnfoldOutlined />, key: '8', },
  ],[selectedProjects]);
  const { me, selectedOrgs } = useAppSelector(meSelector);
  const auth = useAuth()
  useEffect(()=>{
    if (auth?.user && !auth.user.perm) {
      navigate(`/login`)
    }
  },[auth])
  useEffect(() => {
    if (me == null || me == undefined)
      dispatch(fetchMe());
    if (selectedOrgs != null && selectedOrgs !== undefined) {
      dispatch(fetchProjects({ orgId: selectedOrgs!!.Org.id, searchTerm: '' }));
    }
  }, [me, selectedOrgs]);
  useEffect(()=>{
    if(selectedProjects){
      console.log(pathName)
      console.log(selectedProjects.id)
      navigate(`/project/${selectedProjects.id}${pathName=='/project'?'/':pathName==`/${selectedProjects.id}`?"/":pathName}`)
    }
  },[selectedProjects,pathName])
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  

  const projectOptions = projects.map((project) => ({ label: project.name, value: project.id }));

  const handleChange = (value: any) => {
    if(value==="new"){
      setOpenCreate(true)
    } else {
      let projectSelected = projects.find((project) => project.id === value)
      dispatch(selectProjects(projectSelected))
    }
  }

  const ProfileContent = (
    <div style={{ cursor: 'pointer' }}>
      {me?.orgs.map((o: any) => {
        return <p>{o.Org.name}</p>
      })}
      <hr />
      <p onClick={() => clearCookie()}>Logout</p>
    </div>
  );

  
  return (
    <Layout>
      <CreateModal open={openCreate} handleCancel={handleCancel} />
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#fff' }} className='main-left-slider'>
        <div className="demo-logo-vertical" />

        <div className='logo-wrapper'>
          <img src={Logo} alt="My Logo" onClick={() => setCollapsed(!collapsed)} className='logo' />
          <h1 style={{ textTransform: 'capitalize' }}>{selectedOrgs?.Org.domain}</h1>
        </div>


        {!collapsed && <Select
          size={'large'}
          value={selectedProjects ? { label: selectedProjects?.name, id: selectedProjects?.id } : undefined}
          style={{ width: 270, margin: 5 }}
          // options={projectOptions}
          onChange={handleChange}
          placeholder="Select a project"
        >
          {projectOptions.map(opt=><Select.Option value={opt.value}>{opt.label}</Select.Option>)}
          <Select.Option value={"new"}><Button type="primary" style={{ width: '100%' }} onClick={() => setOpenCreate(true)}>New</Button>
          </Select.Option>
          </Select>}
        <Menu
          theme="light"
          mode="inline"
        // defaultSelectedKeys={['1']}
        >
          {navigation().map(({ label, href, icon, key }) => (
            <Menu.Item key={key} icon={icon}>
              <Link to={href}>{label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header style={{
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderBottomColor: '#ddd',
          paddingLeft: 40,
          paddingRight: 40
        }}>
          <h2>{selectedProjects?.name}</h2>
          <div style={{ height: 50, width: 50, borderRadius: "50%" }}>
            <Popover
              content={ProfileContent}
              title={me?.name}
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
              style={{ border: '1px solid red' }}
              overlayStyle={{ marginRight: '210px', color: 'red' }}
              rootClassName="profile-menu"
            >
              <img style={{ height: 50, width: 50, borderRadius: "50%" }} width={'100%'} height={'100%'} src={me ? me.Picture : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="user" />

            </Popover>
          </div>
        </Header>
        <Content
          style={{
            // margin: '24px 16px',
            // padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>

      </Layout>
    </Layout>
  );
}

export default MainLayout;
