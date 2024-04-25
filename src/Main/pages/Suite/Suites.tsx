import { useCallback, useEffect, useState } from "react";
import Suite from "./Suite";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchSuites, suitesSelector, selectSuites, deleteSuite } from "./../../../redux/Slice/suitesSlice";
import { TextInput } from "flowbite-react";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Input, Button, Collapse, Dropdown, Empty } from 'antd';
import CreateModal from './CreateModal'
import SuiteRightPanel from "./SuiteRightPanel";
import {
  PlayCircleOutlined,
  SyncOutlined,
  EditTwoTone,
  DeleteTwoTone
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { dataProfileSelector, fetchProfiles } from "./../../../redux/Slice/dataProfileSlice";
import { useNavigate } from "react-router-dom";
import { useEventSource } from './../../../Context/EventSourceContext'
import Loader from "../../../Components/Loader";
import { createRun } from "../../../redux/Slice/runsSlice";
import { meSelector } from "../../../redux/Slice/meSlice";

const Suites = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [SuiteEdit, setSuiteEdit] = useState({})

  const dispatch = useAppDispatch();
  const { suites, selectedSuites, fetchLoading } = useAppSelector(suitesSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);
  const { selectedOrgs } = useAppSelector(meSelector);
  const { profle } = useAppSelector(dataProfileSelector);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProjects) {
      dispatch(fetchSuites({ projectId: selectedProjects?.id, searchTerm: '' }));
      dispatch(fetchProfiles({ projectId: selectedProjects?.id || 0, searchTerm: '' }));
    }

  }, [selectedProjects]);

  const handleCancel = () => {
    setOpenCreate(false)
  }

  const { getRuns } = useEventSource()


  const StartExecution = (id: number, profileId: number, browser: string, headless: boolean) => {
    dispatch(createRun({projectId:selectedProjects!!.id, body:{
      suite_id: id,
      profile_id: profileId,
      browser: browser,
      headless: headless
    }}))
    navigate(`/org/${selectedOrgs?.org.domain}/${selectedProjects?.id}/runs`)
  }

  const onChange = (key: string | string[]) => {
    const index = key[key.length - 1]
    index && dispatch(selectSuites(suites[Number(index)]))
  };

  const browsers = ["chrome", "chrome-beta", "chrome-dev"]
  // const browsers = ["chrome", "chrome-beta", "chrome-dev", "chrome-canary", "msedge", "msedge-beta", "msedge-dev", "msedge-canary"]
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

  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, suit: any) => {
    // e.stopPropagation()
    setOpenCreate(true)
    setSuiteEdit(suit)
  }


  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, suit: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteSuite({ id: suit.id }))
  }

  const suitItems = suites.map((suit, index) => (
    <Collapse.Panel
      header={suit.name}
      key={index}
      className="resource-panel"
      extra={<div>
        <span className="resource-panel-extra">
          <EditTwoTone onClick={(e) => handleOpenEdit(e, suit)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone onClick={(e) => handleDelete(e, suit)} className="delete-icon" style={{ marginRight: 15 }} />
        </span>
        <Dropdown menu={{ items: generateMenuItems(suit) }} placement="bottom" arrow={{ pointAtCenter: true }}>
          <span onClick={(e) => e.stopPropagation()}>
            {loading ? <SyncOutlined spin style={{ color: '#873cb7' }} /> : <PlayCircleOutlined style={{ color: '#873cb7' }} />}
          </span>
        </Dropdown>
      </div>
      }
    >
      <Suite suite={selectedSuites} />
    </Collapse.Panel>
  ));

  return (
    <div>
      <Row>
        {/* <Col span={12}>
          <Input placeholder="Search Suite" />
        </Col> */}
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Suite </Button>
          <CreateModal suite={SuiteEdit} open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {fetchLoading && <Loader />}

          {suites.length > 0 && <Collapse onChange={onChange} accordion style={{ marginTop: 10 }}>
            {suitItems}
          </Collapse>}
          {suites.length === 0 && !fetchLoading && <div className="my-40">
            <Empty />
          </div>}
        </Col>
      </Row>
    </div>
  );
};

export default Suites;
