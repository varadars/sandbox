import { useState, useEffect } from "react";
import { supabase } from "./lib/client";

function App() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    getGroups();
  }, []);

  async function getGroups() {
    const { data, error } = await supabase
      .from("groups")
      .select();
    setGroups(data);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello Tailwind + Vite!
      </h1>
      <ul>
        {groups.map((group) => (
          <li key={group.name}>{group.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
