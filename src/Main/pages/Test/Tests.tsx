import { useEffect, useState } from "react";
import Test from "./Test";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchTests, testsSelector, selectTests, deleteTest } from "./../../../redux/Slice/testsSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { dataProfileSelector, fetchProfiles } from "./../../../redux/Slice/dataProfileSlice";
import { Row, Col, Input, Button, Collapse, Dropdown, Empty } from 'antd';
import CreateModal from './CreateModal'
import {
  PlayCircleOutlined,
  SyncOutlined,
  EditTwoTone,
  DeleteTwoTone
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useEventSource } from './../../../Context/EventSourceContext'
import Loader from "../../../Components/Loader";

const Tests = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [testeEdit, setTestEdit] = useState({})

  const dispatch = useAppDispatch();
  const { tests, fetchLoading } = useAppSelector(testsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { profle } = useAppSelector(dataProfileSelector);
  const navigate = useNavigate();
  const { getRuns } = useEventSource()

  useEffect(() => {
    if (selectedProjects) {
      dispatch(fetchTests({ projectId: selectedProjects?.id, searchTerm: '' }));
      dispatch(fetchProfiles({ projectId: selectedProjects?.id || 0, searchTerm: '' }));
    }
  }, [selectedProjects]);

  const handleCancel = () => {
    setOpenCreate(false)
  }


  const StartExecution = (id: number, profileId: number, browser: string, headless: boolean) => {
    getRuns(selectedProjects?.id, {
      test_id: id,
      profile_id: profileId,
      browser: browser,
      headless: headless
    })
    navigate(`/project/${selectedProjects?.id}/runs`)
  }

  const browsers = ["chrome", "chrome-beta", "chrome-dev", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", "msedge-canary"]
  const generateMenuItems = (suit: any) => {
    return profle.map((prf) => ({
      key: prf.id.toString(),
      label: (
        <span >
          Start Execution for {prf.name}
        </span>
      ),
      children: browsers.flatMap(b => {
        return [{
          key: b,
          label: (<span onClick={(e) => {
            StartExecution(suit.id, prf.id, b, false)
            e.stopPropagation();
          }}>{b}</span>)
        },
        {
          key: b + "-headless",
          label: (<span onClick={(e) => {
            StartExecution(suit.id, prf.id, b, true)
            e.stopPropagation();
          }}>{b}-headless</span>)
        }
        ]
      })
    }));
  };
  const onChange = (key: string | string[]) => {
    const index = key[key.length - 1]
    dispatch(selectTests(tests[Number(index)]))
  };


  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, test: any) => {
    // e.stopPropagation()
    setOpenCreate(true)
    setTestEdit(test)
  }

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, test: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteTest({ id: test.id }))
  }

  return (
    <div>
      <Row>
        {/* <Col span={12}>
          <Input placeholder="Search Test" />
        </Col> */}
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Tests </Button>
          <CreateModal test={testeEdit} open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {fetchLoading && <Loader />}

          {tests.length > 0 && <Collapse accordion onChange={onChange} style={{ marginTop: 10 }}>
            {tests.map((test, index) => (
              <Collapse.Panel
                header={<div>{test.name}{test.lock!=""?` (lock: ${test.lock})`:""}</div>}
                key={index}
                className="resource-panel"
                extra={<div>
                  <span className="resource-panel-extra">
                    <EditTwoTone onClick={(e) => handleOpenEdit(e, test)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
                    <DeleteTwoTone onClick={(e) => handleDelete(e, test)} className="delete-icon" style={{ marginRight: 15 }} />
                  </span>
                  <Dropdown menu={{ items: generateMenuItems(test) }} placement="bottom" arrow={{ pointAtCenter: true }}>
                    <span onClick={(e) => e.stopPropagation()}>
                      {loading ? <SyncOutlined spin style={{ color: '#873cb7' }} /> : <PlayCircleOutlined style={{ color: '#873cb7' }} />}
                    </span>
                  </Dropdown>
                </div>}
              >
                <Test test={test} />
              </Collapse.Panel>
            ))}
          </Collapse>}
          {tests.length === 0 && !fetchLoading && <div className="my-40">
            <Empty />
          </div>}
        </Col>
      </Row>
    </div>
  );
};

export default Tests;
