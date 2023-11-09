import { createBrowserRouter } from "react-router-dom";
// Auth Router
import AuthLayout from "./Auth/AuthLayout";
import Login from "./Auth/pages/Login";

// Main Router
import MainLayout from "./Main/MainLayout";
import Dashboard from "./Main/pages/Dashboard";
import Element from "./Main/pages/Element";
import Resource from "./Main/pages/Resource";
import PageAction from "./Main/pages/PageAction";
import Step from "./Main/pages/Step";
import Test from "./Main/pages/Test";

const MainRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "/element",
        element: <Element />,
      },
      {
        path: "/resource",
        element: <Resource />,
      },
      {
        path: "/page-action",
        element: <PageAction />,
      },
      {
        path: "/step",
        element: <Step />,
      },
      {
        path: "/test",
        element: <Test />,
      },
    ],
  },
]);

const AuthRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "/step",
        element: <Step />,
      },
    ],
  },
]);

export default function Router() {
  return MainRouter;
}
