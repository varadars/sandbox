import { Route, Routes } from "react-router-dom";
import GroupPage from "../pages/GroupPage";
import PlayerDash from "../pages/PlayerDash";
import Signup from "../pages/Signup";
import PlayerProfile from "../pages/PlayerProfile.tsx";
import App from "../App";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<App />}
      />{" "}
      <Route
        path="/group/:groupId"
        element={<GroupPage />}
      />{" "}
      <Route
        path="/group/:groupId/player/:playerId"
        element={<PlayerDash />}
      />{" "}
      <Route
        path="/signup"
        element={<Signup />}
      />{" "}
      <Route
        path="/profile"
        element={<PlayerProfile />}
      />{" "}
    </Routes>
  );
}

export default AppRoutes;
