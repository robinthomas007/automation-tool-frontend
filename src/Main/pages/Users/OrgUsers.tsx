import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { fetchOrgUsers, upsertOrgUser, usersSelector } from "../../../redux/Slice/usersSlice";
import { meSelector } from "../../../redux/Slice/meSlice";
import { Button, List, Input, Select, Card } from "antd";

export default function OrgUsers() {
  const options = [{
    label: "Owner",
    value: "own"
  },
  {
    label: "Manager",
    value: "manage"
  }, {
    label: "User",
    value: "use"
  }
  ]
  const dispatch = useAppDispatch();
  const { selectedOrgs } = useAppSelector(meSelector)
  const { orgUsers } = useAppSelector(usersSelector)
  const [email, setEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("use")
  useEffect(() => {
    if (selectedOrgs) {
      dispatch(fetchOrgUsers({ orgId: selectedOrgs.org.id }))
    }
  }, [selectedOrgs])
  return (<Card style={{ width: '50%', margin: 10 }}>
    <List
      size="large"
      header={<strong>Organization Users</strong>}
      bordered
      dataSource={orgUsers}
      renderItem={(org) =>
        <List.Item>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '100%' }}>
            <span style={{ color: '#1577ff' }}>{org.email}</span>
            <Select style={{ width: 100 }} value={org.role} options={options} onChange={(value) => {
              dispatch(upsertOrgUser({
                orgId: selectedOrgs!!.org.id, data: {
                  email: org.email,
                  role: value
                }
              }))
            }} />
          </div>
        </List.Item>}
    />
    <div style={{ display: 'flex', width: '94%', marginTop: 15 }}>
      <Select value={selectedRole} onChange={(value) => setSelectedRole(value)} options={options} />
      <Input value={email} style={{ margin: '0px 15px' }} onChange={(e) => setEmail(e.target.value)} />
      <Button type="primary" onClick={() => dispatch(upsertOrgUser({ orgId: selectedOrgs!!.org.id, data: { email, role: selectedRole } }))}>Add</Button>
    </div>
  </Card>)
}