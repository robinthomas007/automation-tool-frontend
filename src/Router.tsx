import { createBrowserRouter, Navigate } from "react-router-dom";
// Auth Router
import AuthLayout from "./Auth/AuthLayout";
import Login from "./Auth/pages/Login";
import { ConfigProvider } from 'antd';

// Main Router
import ProjectsLayout from "./Main/ProjectsLayout";
import Dashboard from "./Main/pages/Dashboard";
import Projects from "./Main/pages/Projects/Projects";
import Resource from "./Main/pages/Resource";
import Steps from "./Main/pages/Step";
import Tests from "./Main/pages/Test";
import Suites from "./Main/pages/Suite";
import LoginPage from "./Main/pages/Guest/Login";
import DataProfile from './Main/pages/DataProfile'
import Runs from "./Main/pages/Runs";
import Users from "./Main/pages/Users/Users";
import OrgUsers from "./Main/pages/Users/OrgUsers";
import OrgsLayout from "./Main/OrgsLayout";
const AuthRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/project",
    element: <ProjectsLayout />,
    children: [
      {
        path: "all",
        element: <Projects />
      },
      {
        path: ":id",
        element: <Dashboard />,
      },
      {
        path: ":id/suites",
        element: <Suites />,
      },
      {
        path: ":id/tests",
        element: <Tests />,
      },
      {
        path: ":id/steps",
        element: <Steps />,
      },
      {
        path: ":id/resources",
        element: <Resource />,
      },
      {
        path: ":id/runs",
        element: <Runs />,
      },
      {
        path: ":id/data_profiles",
        element: <DataProfile />,
      },
      {
        path: ":id/users",
        element: <Users />,
      },

    ],
  },
  {
    path: "/org",
    element: <OrgsLayout />,
    children: [
      {
        path: ":id/users",
        element: <OrgUsers />,
      },

    ],
  },

]);

export default function Router() {
  return AuthRouter;
}
