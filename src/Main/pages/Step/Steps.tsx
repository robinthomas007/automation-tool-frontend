import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "./../../../redux/hooks";
import { fetchSteps, stepsSelector, selectSteps, deleteStep, selectResourceAction } from "./../../../redux/Slice/stepsSlice";
import { projectsSelector } from "./../../../redux/Slice/projectsSlice";
import { Row, Col, Input, Button, Collapse, Empty } from 'antd';
import Step from './Step'
import CreateModal from './CreateModal'
import StepsRightPanel from './StepsRightPanel'
import {
  EditTwoTone,
  DeleteTwoTone
} from '@ant-design/icons';
import Loader from "../../../Components/Loader";

const Steps = ({ showSelected }: { showSelected: boolean }) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false)
  const [stepeEdit, setStepEdit] = useState({})
  const [search, setSearch] = useState('')

  const dispatch = useAppDispatch();
  const { steps, fetchLoading } = useAppSelector(stepsSelector);
  const { selectedProjects } = useAppSelector(projectsSelector);


  const onChange = (key: string | string[]) => {
    if (key.length)
      dispatch(selectSteps(steps[Number(key)]))
  };

  useEffect(() => {
    if (selectedProjects)
      dispatch(fetchSteps({ projectId: selectedProjects?.id, searchTerm: search }));
    return () => {
      dispatch(selectSteps(null))
    }
  }, [selectedProjects, search, dispatch]);

  const handleCancel = () => {
    setOpenCreate(false)
  }

  const handleOpenEdit = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, step: any) => {
    // e.stopPropagation()
    setOpenCreate(true)
    setStepEdit(step)
  }

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, step: any) => {
    e.stopPropagation()
    // eslint-disable-next-line no-restricted-globals
    const isConfirmed = confirm("Are you sure you want to delete this item?");
    isConfirmed && dispatch(deleteStep({ id: step.id }))
  }

  const handleChangeSteps = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputSearch = e.target.value
    if (inputSearch.length >= 3) {
      setSearch(inputSearch)
    }
    if (inputSearch.length === 0) {
      setSearch('')
    }
  }

  const stepItems = steps.map((step, index) => (
    <Collapse.Panel
      className="resource-panel"
      header={step.name}
      key={index}
      extra={
        <span className="resource-panel-extra">
          <EditTwoTone onClick={(e) => handleOpenEdit(e, step)} className="edit-icon" style={{ marginLeft: 10, marginRight: 10 }} />
          <DeleteTwoTone onClick={(e) => handleDelete(e, step)} className="delete-icon" />
        </span>
      }
    >
      <Step step={step} />
    </Collapse.Panel>
  ));

  return (
    <div>
      <Row>
        {/* <Col span={12}>
          <Input placeholder="Search Steps" onChange={handleChangeSteps} />
        </Col> */}
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => setOpenCreate(true)}>Create Steps</Button>
          <CreateModal step={stepeEdit} open={openCreate} handleCancel={handleCancel} />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {fetchLoading && <Loader />}

          {steps.length > 0 &&
            <Collapse onChange={onChange} accordion destroyInactivePanel={true} style={{ marginTop: 10 }} >
              {stepItems}
            </Collapse>}
          {steps.length === 0 && !fetchLoading && <div className="my-40">
            <Empty />
          </div>}
        </Col>
      </Row>
    </div>
  );
};

export default Steps;
