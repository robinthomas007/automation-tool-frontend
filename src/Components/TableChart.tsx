import { Card, Col, Table, } from "antd";
import { ItemStat } from "../redux/Slice/projectsSlice";

export default function TableChart({ data }: { data: ItemStat }) {

  const tabledata = data.items.map(ci => ({ key: ci.name, name: ci.name, ...Object.fromEntries(ci.items.map(i => [i.name, i.value])) }))
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  }, ...data.items[0].items.map(i => ({ title: i.name, dataIndex: i.name, key: i.name }))]
  return (
    <Col span={24} style={{ marginBottom: 10 }}>
      <Card title={data.name}>
        <Table dataSource={tabledata} columns={columns} />
      </Card>
    </Col>
  )
}