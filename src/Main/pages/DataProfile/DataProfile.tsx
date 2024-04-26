
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchProfiles, dataProfileSelector, setSelectedProfile, deleteProfile } from "./../../../redux/Slice/dataProfileSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Button, Collapse, Dropdown } from 'antd';
import CreateModal from './CreateModal'
import DataProfileRightPanel from './DataProfileRightPanel'
import Variable from "./Variable";

import {
  DeleteTwoTone
} from '@ant-design/icons';
const DataProfile = () => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)

  const dispatch = useAppDispatch();
  const { profle } = useAppSelector(dataProfileSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);

  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchProfiles({ projectId: selectedProjects?.id, searchTerm: '' }));
  }, [selectedProjects]);

  const handleCancel = () => {
    setOpenCreate(false)
  }
  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, profile: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteProfile({ id: profile.id }))
  }

  const onChange = (key: string | string[]) => {
    const index = key[key.length - 1]
    dispatch(setSelectedProfile(profle[Number(index)]))
  };

  return (
    <div className="data-root">
      <Row className="filter">
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Profile </Button>
          <CreateModal open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Collapse
          onChange={onChange} accordion
          className="data"
          >
            {profle.map((profile: any, index: any) => (
              <Collapse.Panel
                header={profile.name}
                className="resource-panel"
                key={index}
                extra={<div className="flex items-center">
                  <span className="resource-panel-extra flex">
                    <DeleteTwoTone onClick={(e) => handleDelete(e, profile)} className="delete-icon" style={{ marginRight: 15 }} />
                  </span>
                </div>}
              >
                <Variable variables={profile.variables} profileId={profile.id} />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Col>
      </Row>
    </div>
  );
};

export default DataProfile;
