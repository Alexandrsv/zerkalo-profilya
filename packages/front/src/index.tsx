import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import * as Sentry from "@sentry/react";
import reportWebVitals from "./reportWebVitals";
import { AdaptivityProvider, ConfigProvider } from "@vkontakte/vkui";
import { initBridge } from "./bridge";
import { HashRouter } from "react-router-dom";
import App from "./App";

initBridge();

const isDev = import.meta.env.MODE === "development";

if (isDev) import("./eruda");

if (!isDev) {
  // Sentry.init({
  //   dsn: import.meta.env.VITE_REACT_APP_SENTRY_DSN,
  //   integrations: [new BrowserTracing()],
  //   tracesSampleRate: 1.0,
  // });
  Sentry.init({
    dsn: import.meta.env.VITE_REACT_APP_HOME_SENTRY_DSN,
    integrations: [],
    tracesSampleRate: 1.0,
  });
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ConfigProvider
  // appearance={"dark"}
  //
  // scheme={"inherit"}
  >
    <AdaptivityProvider>
      <React.StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </React.StrictMode>
    </AdaptivityProvider>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
