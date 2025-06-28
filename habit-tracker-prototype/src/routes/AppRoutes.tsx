import { Route, Routes } from "react-router-dom";
import GroupPage from "../pages/GroupPage";
import PlayerDash from "../pages/PlayerDash";
import Signup from "../pages/Signup";
import PlayerProfile from "../pages/PlayerProfile.tsx";
import PlayerProgress from "../pages/PlayerProgress.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import App from "../App";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<App />}
      />
      <Route
        path="/group/:groupId"
        element={
          <ProtectedRoute>
            <GroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group/:groupId/player/:playerId"
        element={
          <ProtectedRoute>
            <PlayerDash />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group/:groupId/player/:playerId/progress"
        element={
          <ProtectedRoute>
            <PlayerProgress />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={<Signup />}
      />
      <Route
        path="/profile"
        element={<PlayerProfile />}
      />
    </Routes>
  );
}

export default AppRoutes;
