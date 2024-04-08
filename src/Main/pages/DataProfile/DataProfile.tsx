
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchProfiles, dataProfileSelector, setSelectedProfile } from "./../../../redux/Slice/dataProfileSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Button, Collapse } from 'antd';
import CreateModal from './CreateModal'
import DataProfileRightPanel from './DataProfileRightPanel'
import Variable from "./Variable";


const DataProfile = ({ showSelected }: any) => {
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

  const onChange = (key: string | string[]) => {
    const index = key[key.length - 1]
    dispatch(setSelectedProfile(profle[Number(index)]))
  };

  return (
    showSelected ? <div>
      <Row>
        {/* <Col span={12}>
          <Input placeholder="Search Profile" />
        </Col> */}
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Profile </Button>
          <CreateModal open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {showSelected && <Collapse onChange={onChange} accordion style={{ marginTop: 10 }}>
            {profle.map((profile: any, index: any) => (
              <Collapse.Panel
                header={profile.name}
                key={index}
              >
                <Variable variables={profile.variables} profileId={profile.id} />
              </Collapse.Panel>
            ))}
          </Collapse>}
        </Col>
      </Row>
    </div> : <DataProfileRightPanel />
  );
};

export default DataProfile;
