import { useState, useEffect } from "react";
import type { MouseEvent } from "react";
import { supabase } from "./lib/client";

function App() {
  type Group = {
    id: string;
    name: string;
    description: string;
  };

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    getGroups();
  }, []);

  async function getGroups() {
    const { data, error } = await supabase
      .from("groups")
      .select(`id, name, description, players (player_id)`);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setGroups(data);
      console.log(data);
    }
  }

  const handleClick = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    window.open("https://www.google.com", "_blank");
  };

  return (
    <div className="grid min-h-screen place-items-center">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello Players!
      </h1>
      <section className="bg-gray-100 shadow rounded-2xl p-6">
        <ul className="grid gap-5">
          {groups.map((group) => (
            <li key={group.name}>
              <button
                className="w-full max-w-sm text-left p-4 bg-white rounded-2xl shadow hover:shadow-lg transition hover:bg-gray-200"
                onClick={handleClick}
              >
                <h2 className="text-2xl font-bold mb-4">
                  {group.name}
                </h2>
                <p>{group.description}</p>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
