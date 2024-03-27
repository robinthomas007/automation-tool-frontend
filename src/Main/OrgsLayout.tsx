
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
import { Layout, Menu, theme, Popover, Button, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMe, meSelector, selectOrgs } from "../redux/Slice/meSlice";
import { useLocation } from 'react-router-dom';
import { Select } from 'antd';
import { useAuth } from '../Context/authContext'
import './main.css'
import Logo from './../Images/logo.svg'
import { clearCookie } from '../Lib/auth'
import CreateModal from './pages/Projects/CreateModal';
import { useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Title } = Typography

const OrgsLayout: React.FC = () => {

  const { id } = useParams();
  const location = useLocation();
  const [pathName, setPathName] = useState("");
  useEffect(() => {
    if (location) {
      let tmp = location.pathname.slice(location.pathname.lastIndexOf("/"), location.pathname.length);
      setPathName(tmp);
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

  const { selectedOrgs, me } = useAppSelector(meSelector);
  const auth = useAuth()
  const navigation = useCallback(() => [
    { label: "Users", href: `/org/${selectedOrgs?.org.id}/users`, icon: <MenuUnfoldOutlined />, key: `/project/${selectedOrgs?.org.id}/users`, },
  ], [selectedOrgs]);
  useEffect(() => {
    if (auth?.user && !auth.user.perm) {
      navigate(`/login`)
    }
  }, [auth])
  useEffect(() => {
    if (me == null || me == undefined)
      dispatch(fetchMe());
  }, [me, selectedOrgs]);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };


  const orgOptions = me?.orgs.map((org) => ({ label: org.org.name, value: org.org.id }));

  const handleChange = (value: any) => {
    if (value === "new") {
      setOpenCreate(true)
    } else {
      let orgSelected = me?.orgs.find((org) => org.org.id === value)
      dispatch(selectOrgs(orgSelected))
    }
  }

  const ProfileContent = (
    <div style={{ cursor: 'pointer' }}>
      {me?.orgs.map((o: any, index: number) => {
        return <p key={index}>{o.org.name}</p>
      })}
      <hr />
      <p onClick={() => clearCookie()}>Logout</p>
    </div>
  );


  return (
    <Layout>
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
          <Title level={2} className='my-3'>{selectedOrgs?.org.name}</Title>
          <Link to={`/project`}>Projects</Link>
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
              <img style={{ height: 50, width: 50, borderRadius: "50%" }} width={'100%'} height={'100%'} src={me ? me.picture : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt="user" />

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

export default OrgsLayout;
