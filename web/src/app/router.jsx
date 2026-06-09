import { createBrowserRouter } from "react-router";

import App from "./App.jsx";
import { RepoAnalyzerHome } from "../features/repositories/RepoAnalyzerHome.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <RepoAnalyzerHome />,
      },
    ],
  },
]);
