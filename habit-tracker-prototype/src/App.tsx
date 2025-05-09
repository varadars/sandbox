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
    <div className="flex flex-col items-center min-h-screen justify-center">
      <h1 className="text-5xl font-bold text-blue-600 mb-12">
        Hello Players!
      </h1>
      <section className="bg-gray-100 shadow rounded-2xl p-6">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {groups.map((group) => (
            <li key={group.name}>
              <button
                className="w-full max-w-xs h-60 flex flex-col justify-center text-left p-4 bg-white rounded-2xl shadow hover:shadow-lg transition hover:bg-gray-200"
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
