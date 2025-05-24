import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { supabase } from "./lib/client";
import { ChartDonut } from "@phosphor-icons/react";
import { LoginTab } from "@/components/LoginTab";

function App() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen gap-4">
      <Navbar />
      <div className="flex items-center flex-col my-25 min-h-screen p-4 gap-4">
        <div className="inline-flex items-center gap-4">
          <ChartDonut
            color="var(--primary)"
            size={64}
            weight="duotone"
          />
          <h1 className="text-2xl font-bold">
            Welcome to Habitual Flywheel!
          </h1>
        </div>

        <LoginTab />
      </div>
    </div>
  );
}

export default App;
