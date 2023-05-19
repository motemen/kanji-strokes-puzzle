import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { QueryParamProvider } from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryParamProvider adapter={WindowHistoryAdapter}>
      <App />
    </QueryParamProvider>
  </React.StrictMode>
);
