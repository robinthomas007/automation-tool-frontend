import { createBrowserRouter } from "react-router-dom";
// Auth Router

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
import LogInStatus from "./Main/pages/LogInStatus";
import APIKeys from "./Main/pages/APIKeys/APIKeys";
import Files from "./Main/pages/Files/Files";
// const AuthRouter = createBrowserRouter([
//   {
//     path: "/",
//     element: <LoginPage />
//   },
//   {
//     path: "/loginStatus",
//     element: <LogInStatus />
//   },
//   {
//     path: "/project",
//     element: <ProjectsLayout />,
//     children: [
//       {
//         path: "all",
//         element: <Projects />
//       },
//       {
//         path: ":id",
//         element: <Dashboard />,
//       },
//       {
//         path: ":id/suites",
//         element: <Suites />,
//       },
//       {
//         path: ":id/tests",
//         element: <Tests />,
//       },
//       {
//         path: ":id/steps",
//         element: <Steps />,
//       },
//       {
//         path: ":id/resources",
//         element: <Resource />,
//       },
//       {
//         path: ":id/runs",
//         element: <Runs />,
//       },
//       {
//         path: ":id/data_profiles",
//         element: <DataProfile />,
//       },
//       {
//         path: ":id/users",
//         element: <Users />,
//       },
//       {
//         path: ":id/keys",
//         element: <APIKeys />,
//       },
//       {
//         path: ":id/files",
//         element: <Files />,
//       },
//     ],
//   },
//   {
//     path: "/org",
//     element: <OrgsLayout />,
//     children: [
//       {
//         path: ":id/users",
//         element: <OrgUsers />,
//       },

//     ],
//   },

// ]);
const AuthRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>
  },
  {
    path: "/loginStatus",
    element: <LogInStatus />
  },
  {
    path:"/org",
    element: <OrgsLayout />,
    children: [
      {
        path: ":domain",
        children: [
          {
            path: "users",
            element: <OrgUsers />,
          },
          {
            path: "projects",
            element: <Projects />,
          },
          {
            path: "",
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
              {
                path: ":id/keys",
                element: <APIKeys />,
              },
              {
                path: ":id/files",
                element: <Files />,
              },
            ],
          },
    
        ],
        
      },

    ]
  }
]);
export default function Router() {
  return AuthRouter;
}
