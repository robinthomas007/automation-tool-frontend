import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { fetchOrgUsers, upsertOrgUser, usersSelector } from "../../../redux/Slice/usersSlice";
import { meSelector } from "../../../redux/Slice/meSlice";
import { Button, List, Input, Select, Card, Form } from "antd";

interface OrgUserFormValues {
  role: string;
  email: string;
}

export default function OrgUsers() {
  const options = [
    { label: "Owner", value: "own" },
    { label: "Admin", value: "admin" },
    { label: "Manager", value: "manage" },
    { label: "User", value: "use" }
  ];

  const dispatch = useAppDispatch();
  const { selectedOrgs } = useAppSelector(meSelector);
  const { orgUsers } = useAppSelector(usersSelector);

  const [form] = Form.useForm<OrgUserFormValues>();

  useEffect(() => {
    if (selectedOrgs) {
      dispatch(fetchOrgUsers({ orgId: selectedOrgs.org.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrgs]);

  const onFinish = (values: OrgUserFormValues) => {
    dispatch(upsertOrgUser({
      orgId: selectedOrgs?.org.id!,
      data: {
        email: values.email,
        role: values.role
      }
    }));
    form.resetFields();
  };

  return (
    <Card style={{ width: '50%', margin: 10 }}>
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
      <Form<OrgUserFormValues> form={form} onFinish={onFinish} style={{ width: '94%', marginTop: 15 }} className="flex justify-between gap-2">
        <Form.Item name="role" initialValue={'use'}>
          <Select options={options} />
        </Form.Item>
        <Form.Item className="w-full" name="email" rules={[{ required: true, message: 'Please input an email!' }, { type: 'email', message: 'Please enter a valid email address!' }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Add</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
