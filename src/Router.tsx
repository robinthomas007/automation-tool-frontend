import { createBrowserRouter, Navigate } from "react-router-dom";
// Auth Router
import AuthLayout from "./Auth/AuthLayout";
import Login from "./Auth/pages/Login";
import { ConfigProvider } from 'antd';

// Main Router
import MainLayout from "./Main/MainLayout";
import Dashboard from "./Main/pages/Dashboard";
import Projects from "./Main/pages/Projects/Projects";
import Resource from "./Main/pages/Resource";
import Steps from "./Main/pages/Step";
import Tests from "./Main/pages/Test";
import Suites from "./Main/pages/Suite";
import LoginPage from "./Main/pages/Guest/Login";
import DataProfile from './Main/pages/DataProfile'
const AuthRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/project",
    element: <MainLayout />,
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
        element: <Resource />,
      },
      {
        path: ":id/data_profiles",
        element: <DataProfile />,
      },

    ],
  },

], { basename: '/sedstartf' });

export default function Router() {
  return AuthRouter;
}
