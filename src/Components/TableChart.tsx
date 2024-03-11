import { Card, Col, Grid, Layout, Row, Statistic, Table, theme } from "antd";
import { CategoryStat, ItemStat, StatItem } from "../redux/Slice/projectsSlice";
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
type Props = {
  stat: ItemStat
}

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