import React from 'react'
import { Run as RunModel, runsSelector, selectRuns } from "../../../redux/Slice/runsSlice";
import { Row, Col } from 'antd';
import { List } from 'antd';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
const RunsRightPanel = () => {
  const { runs } = useAppSelector(runsSelector);
  const dispatch = useAppDispatch();

  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <List
          header={<div>Runs</div>}
          bordered
          dataSource={runs}
          renderItem={(item, index) => (
            <List.Item onClick={(e)=>{
              dispatch(selectRuns(item))
            }}>
              {item.result.name}
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}
export default RunsRightPanel