import React, { useEffect, useState } from 'react'
import { fetchRuns, runsSelector, selectRuns } from "../../../redux/Slice/runsSlice";
import { Row, Col, Input } from 'antd';
import { List } from 'antd';
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { projectsSelector } from '../../../redux/Slice/projectsSlice';
import { Icon } from './Run';

const RunsRightPanel = () => {
  const { runs : allRuns, selectedRunId } = useAppSelector(runsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const [searchText,setSearchText] = useState('')
  const [runs,setRuns] = useState<any[]>([])
  useEffect(()=>{
    setRuns(allRuns.filter(item=>{
      var tname=new Date(item.created_at).toLocaleString() + "(" + item.result.name + ")"
      tname = tname.toLowerCase()
      return tname.includes(searchText.toLowerCase())
    }).reverse())
  },[searchText,allRuns])
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchRuns({ projectId: selectedProjects.id, searchTerm: '' }))
  }, [selectedProjects])
  return (
    <Row>
      <Col span={24}>
        <List
          header={<div className='flex flex-row'><span>Runs</span><span className='ml-2 w-full'><Input type='text' name='searchText' placeholder="filter" value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}/></span></div>}
          bordered
          dataSource={runs}
          renderItem={(item, index) => (
            <List.Item onClick={(e) => {
              dispatch(selectRuns(item.id))
            }}>
              <span className={selectedRunId === item.id ? 'activeRun' : ''}><Icon status={item.result.status}/> {new Date(item.created_at).toLocaleString() + "(" + item.result.name + ")"}</span>
            </List.Item>
          )}
        />
      </Col>
    </Row>
  )
}
export default RunsRightPanel