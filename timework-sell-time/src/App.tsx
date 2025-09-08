import ComponentsShowcase from "./pages/ComponentsShowcase";
import { useState } from "react";
import "./globals.css";
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dev/showcase"
          element={<ComponentsShowcase />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
