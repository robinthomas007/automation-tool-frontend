import ReactDOM from "react-dom/client";
// import "./index.scss";
import router from "./Router";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './Context/authContext'

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <ConfigProvider theme={{
      algorithm: theme.defaultAlgorithm,
    }}>
      <AuthProvider>
        <RouterProvider router={router()} />
      </AuthProvider>
    </ConfigProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
