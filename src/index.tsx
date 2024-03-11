import ReactDOM from "react-dom/client";
import "./index.scss";
import router from "./Router";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ConfigProvider, theme } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import { AuthProvider } from './Context/authContext'
import { EventSourceProvider } from './Context/EventSourceContext'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
    }}>
      <AuthProvider>
        <StyleProvider hashPriority="high">
          <EventSourceProvider>
            <ToastContainer />
            <RouterProvider router={router()} />
          </EventSourceProvider>
        </StyleProvider>
      </AuthProvider>
    </ConfigProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
