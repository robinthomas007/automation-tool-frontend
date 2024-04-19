
import React, { useState, useEffect } from 'react';

import { Outlet, Link } from "react-router-dom";
import { Layout, theme, Popover, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchMe, meSelector } from "../redux/Slice/meSlice";
import { useAuth } from '../Context/authContext'
import './main.css'
import { clearCookie } from '../Lib/auth'
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title } = Typography

const OrgsLayout: React.FC = () => {


  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const dispatch = useAppDispatch();

  const { selectedOrgs, me } = useAppSelector(meSelector);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, selectedOrgs]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

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
    <Layout style={{height:"100vh"}}>
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
