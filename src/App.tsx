import Login from "./pages/authLogin/AuthLogin";
import Feed from "./pages/feed/Feed";

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
        <Route path={eRoutes.feed} element={<Feed />} />
      </Routes>
    </>
  );
}

export default App;
