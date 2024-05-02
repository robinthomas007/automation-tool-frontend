import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchProjectUsers, upsertProjectUser, usersSelector } from "../../../redux/Slice/usersSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Button, List, Input, Select, Form } from "antd";

const { Option } = Select;

const options = [
  { label: "Manager", value: "manage" },
  { label: "Developer", value: "develop" },
  { label: "Verifier", value: "execute" }
];

const ProjectUsers: React.FC = () => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const { projectUsers } = useAppSelector(usersSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (selectedProjects) {
      dispatch(fetchProjectUsers({ projectId: selectedProjects.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjects]);


  const onFinish = (values: any) => {
    dispatch(upsertProjectUser({ projectId: selectedProjects!!.id, data: { email: values.email, role: values.role } }));
  }

  return (
    <div className="data-content">
    <div className="data-root">
      <div className="filter">
        <Form form={form} onFinish={onFinish} className="flex gap-2">
          <Form.Item
            name="role"
            initialValue="execute"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select style={{ width: 150 }}>
              {options.map(option => (
                <Option key={option.value} value={option.value}>{option.label}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input an email!' },
              { type: 'email', message: 'Please enter a valid email address!' }
            ]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Add</Button>
          </Form.Item>
        </Form>
      </div>
      <List
        size="large"
        bordered
        dataSource={projectUsers}
        className="data"
        renderItem={(project) => (
          <List.Item>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '40%' }}>
              <span style={{ color: '#1577ff' }}>{project.email}</span>
              <Select style={{ width: 100 }} value={project.role} options={options} onChange={(value) => {
                dispatch(upsertProjectUser({
                  projectId: selectedProjects!!.id, data: {
                    email: project.email,
                    role: value
                  }
                }));
              }} />
            </div>
          </List.Item>
        )}
      />
      
    </div>
    </div>
  );
};

export default ProjectUsers;
