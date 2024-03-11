import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { fetchProjectUsers, upsertProjectUser, usersSelector } from "../../../redux/Slice/usersSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";

import { Button, List, Input, Select } from "antd";

const options = [{
  label: "Manager",
  value: "manage"
},
{
  label: "Developer",
  value: "develop"
}, {
  label: "Verifier",
  value: "execute"
}
]

export default function ProjectUsers() {
  const [selectedRole, setSelectedRole] = useState("execute")
  const [email, setEmail] = useState("")

  const dispatch = useAppDispatch();
  const { projectUsers } = useAppSelector(usersSelector)
  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (selectedProjects) {
      dispatch(fetchProjectUsers({ projectId: selectedProjects.id }))
    }
  }, [selectedProjects])

  return (<div>
    <List
      size="large"
      footer={<div style={{ display: 'flex', width: '40%' }}>
        <Select value={selectedRole} onChange={(value) => setSelectedRole(value)} options={options} style={{ width: 150 }} />
        <Input value={email} style={{ margin: '0px 15px' }} onChange={(e) => setEmail(e.target.value)} />
        <Button type="primary" onClick={() => dispatch(upsertProjectUser({ projectId: selectedProjects!!.id, data: { email, role: selectedRole } }))}>Add</Button>
      </div>}
      bordered
      dataSource={projectUsers}
      renderItem={(project) =>
        <List.Item>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '40%' }}>
            <span style={{ color: '#1577ff' }}>{project.email}</span>
            <Select style={{ width: 100 }} value={project.role} options={options} onChange={(value) => {
              dispatch(upsertProjectUser({
                projectId: selectedProjects!!.id, data: {
                  email: project.email,
                  role: value
                }
              }))
            }} />
          </div>
        </List.Item>}
    />
  </div>)
}