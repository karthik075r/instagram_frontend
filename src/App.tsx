import Login from "./pages/authLogin/AuthLogin";
import Dashboard from "./pages/dashboard/Dashboard";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import { eRoutes } from "./utils/constants";
import Callback from "./pages/callback/Callback";

function App() {
  return (
    <>
      <Routes>
        <Route path={eRoutes.login} element={<Login />} />
        <Route path={eRoutes.callback} element={<Callback />} />
        <Route path={eRoutes.dashboard} element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
