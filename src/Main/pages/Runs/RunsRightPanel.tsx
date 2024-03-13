import React, { useEffect, useState } from 'react'
import { fetchRuns, runsSelector, selectRuns } from "../../../redux/Slice/runsSlice";
import { Row, Col } from 'antd';
import { List } from 'antd';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { projectsSelector } from '../../../redux/Slice/projectsSlice';

const RunsRightPanel = () => {
  const { runs, selectedRunId } = useAppSelector(runsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchRuns({ projectId: selectedProjects.id, searchTerm: '' }))
  }, [selectedProjects])
  return (
    <Row style={{ marginTop: 20 }}>
      <Col span={24}>
        <List
          header={<div>Runs</div>}
          bordered
          dataSource={runs}
          renderItem={(item, index) => (
            <List.Item onClick={(e) => {
              dispatch(selectRuns(item.id))
            }}>
              <span className={selectedRunId === item.id ? 'activeRun' : ''}>  {new Date(item.created_at).toLocaleString() + "(" + item.result.name + ")"}</span>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}
export default RunsRightPanel