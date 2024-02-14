import { Button } from "antd";
import { getGoogleUrl } from "../../../Lib/auth";
import { useLocation, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Logo from './../../../Images/logo.svg'
import Sedin from './../../../Images/sedin.svg'
import Google from './../../../Images/google.png'
import { useAuth } from './../../../Context/authContext'


const { Sider, Content } = Layout;

export default function LoginPage() {
  const location = useLocation();
  const from = ((location.state as any)?.from?.pathname as string) || '/profile';

  const auth = useAuth()
  console.log(auth)
  if (auth?.user && auth.user.perm) {
    
    return <Navigate to="/project" state={{ path: location.pathname }} />
  }

  return (
    <Layout>

      <Content
        style={{
          minHeight: '100vh',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: 'center', minHeight: '100vh', }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={Logo} alt="My Logo" width={100} />
            <img src={Sedin} alt=" Sedin" width={250} style={{ marginLeft: 20 }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 className="">Our business is transforming yours. <br />One outcome at a time.</h1>
            <p>We build solutions for enterprises, startups, and market leaders.</p>
          </div>
        </div>
      </Content>
      <Sider trigger={null} style={{ background: '#fff' }} className='login-right-slider'>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", justifyContent: 'center', minHeight: '100vh' }}>
          <h1 style={{ textAlign: 'center' }}>SEDSTART</h1>

          <Button
            href={getGoogleUrl(from)}
            style={{ backgroundColor: '#fff', color: '#000', height: 60 }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={Google} alt="Google" style={{ marginRight: '8px', height: '50px', width: 'auto' }} />
              <span style={{ fontSize: 16, fontWeight: 'bold', color: "#6f6d6d" }}>Login with Google</span>
            </div>
          </Button>
        </div>

      </Sider>
    </Layout>
  )


}