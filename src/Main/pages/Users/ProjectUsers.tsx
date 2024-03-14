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
  const [error, setError] = useState(false)

  const dispatch = useAppDispatch();
  const { projectUsers } = useAppSelector(usersSelector)
  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (selectedProjects) {
      dispatch(fetchProjectUsers({ projectId: selectedProjects.id }))
    }
  }, [selectedProjects])

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const add = () => {
    if (validateEmail(email))
      dispatch(upsertProjectUser({ projectId: selectedProjects!!.id, data: { email, role: selectedRole } }))
    else {
      setError(true)
    }
  }


  return (<div>
    <List
      size="large"
      footer={
        <div style={{ display: 'flex', width: '40%' }}>
          <Select value={selectedRole} onChange={(value) => setSelectedRole(value)} options={options} style={{ width: 150 }} />
          <div>
            <Input value={email} style={{ margin: '0px 15px' }} onChange={(e) => { setError(false); setEmail(e.target.value) }} />
            {error && <div className="text-red-600 flex-none ml-5">Invalid Email</div>}
          </div>
          <Button type="primary" onClick={() => add()}>Add</Button>
        </div>
      }
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