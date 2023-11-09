import { createBrowserRouter } from "react-router-dom";
// Main Router
import MainLayout from "./Main/MainLayout";
import Dashboard from "./Main/pages/Dashboard";
import Step from "./Main/pages/Step";

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
        path: "/step",
        element: <Step />,
      },
    ],
  },
]);

const AuthRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
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
