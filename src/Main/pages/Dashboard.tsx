import { Link } from "react-router-dom";
import { projectsSelector } from "../../redux/Slice/projectsSlice";
import { useAppSelector } from "../../redux/hooks";

const ProjectSummary = () => {
  const { selectedProjects } = useAppSelector(projectsSelector)
  return <div>
    <div>{selectedProjects?.name}</div>
    <div>
    <div>
      <Link to={`suites`}>
        <span>Suites: </span><span>{selectedProjects?.suites.length}</span>
      </Link>
      </div>
      <div>
      <Link to={`tests`}>
        <span>Tests: </span><span>{selectedProjects?.tests.length}</span>
      </Link>
      </div>
      <div>
      <Link to={`steps`}>
        <span>Steps: </span><span>{selectedProjects?.steps.length}</span>
      </Link>
      </div>
      <div>
      <Link to={`resources`}>
        <span>Resources: </span><span>{selectedProjects?.resources.length}</span>
      </Link>
      </div>
      
    </div>
    
    </div>
}
const Dashboard = () => {
  return (
    <div>
      <div className="flex items-center">
        <ProjectSummary />
      </div>
    </div>
  );
};

export default Dashboard;
