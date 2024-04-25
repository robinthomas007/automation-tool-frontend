
import React, { useState, useEffect } from 'react';
import Logo from './../Images/logo.svg'

import { Outlet, Link, useParams } from "react-router-dom";
import { Layout, theme, Popover, Typography, Select, Button, Menu } from 'antd';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMe, meSelector, selectOrgs } from "../redux/Slice/meSlice";
import { useAuth } from '../Context/authContext'
import './main.css'
import { clearCookie } from '../Lib/auth'
import { useNavigate } from "react-router-dom";
import { fetchProjects, projectsSelector, selectProjects } from '../redux/Slice/projectsSlice';
import CreateModal from './pages/Projects/CreateModal';

const { Header, Content } = Layout;
const { Title } = Typography

const OrgsLayout: React.FC = () => {
  const { domain } = useParams();
  const [openCreate, setOpenCreate] = useState<boolean>(false)


  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useAppDispatch();

  const { selectedOrgs, me } = useAppSelector(meSelector);
  const { selectedProjects, projects } = useAppSelector(projectsSelector);
  const auth = useAuth()

  useEffect(() => {
    if (auth?.user && !auth.user.perm) {
      navigate(`/login`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth])
  useEffect(() => {
    if (me == null || me === undefined)
      dispatch(fetchMe());
    else
      selectOrgs(me.orgs[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);
  useEffect(()=>{
    if (domain)
      dispatch(selectOrgs(me?.orgs.find(o => o.org.domain == domain)))
    else if (me?.orgs[0]){
      navigate(`/org/${me.orgs[0].org.domain}`)
    }
  },[me,domain])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const ProfileContent = (
    <div style={{ cursor: 'pointer' }}>
      {me?.orgs.map((o: any, index: number) => {
        return <p key={index} onClick={(e) =>navigate(`/org/${o.org.domain}/projects`)}>{o.org.name}</p>
      })}
      <hr />
      <p onClick={() => clearCookie('token')}>Logout</p>
    </div>
  );
  useEffect(() => {
    if (selectedOrgs != null && selectedOrgs !== undefined) {
      dispatch(fetchProjects({ orgId: selectedOrgs!!.org.id, searchTerm: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgs]);
  const handleCancel = () => {
    setOpenCreate(false)
  }
  return (
    <Layout style={{ height: "100vh" }}>
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
          <CreateModal open={openCreate} handleCancel={handleCancel} />
          <div className='logo-wrapper'>
            <img src={Logo} alt={selectOrgs.name} width={52} height={52}/>
            <Title
              level={3}
              className='my-1'
              style={{
                textTransform: 'capitalize', overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >{selectedOrgs?.org.name}</Title>
          </div>
          <div>
            
          </div>
          <Menu
          theme="light"
          mode="horizontal"
          style={{ flex:1, minWidth: 0 }}
        >
          <Menu.Item>
            <Link to={`/org/${selectedOrgs?.org.domain}/users`}>Users</Link>
          </Menu.Item>
          <Menu.Item>
          <Link to={`/org/${selectedOrgs?.org.domain}/projects`}>Projects</Link>
          </Menu.Item>
          
          
        </Menu>
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
