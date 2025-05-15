import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { supabase } from "./lib/client";

function App() {
  const navigate = useNavigate();

  type Player = {
    player_id: string;
    player_name: string;
  };

  type Group = {
    id: string;
    name: string;
    description: string;
    players: Player[];
  };

  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    getGroups();
  }, []);

  async function getGroups() {
    const { data, error } = await supabase
      .from("groups")
      .select(
        `id, name, description, players (player_id, player_name)`
      );

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setGroups(data);
    }
  }

  const handleClick = (groupId: string) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> {/* This stays at the top */}
      <main className="flex flex-col items-center flex-1 justify-center">
        <h1 className="text-8xl font-bold text-blue-600 mb-5">
          Hello Players!
        </h1>
        <p className="mt-2 mb-10 italic tracking-wider">
          welcome to habitual flywheel...
        </p>
        <section className="bg-gray-100 shadow rounded-2xl p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {groups.map((group) => (
              <li key={group.name}>
                <button
                  className="w-full max-w-xs h-60 flex flex-col justify-center text-left p-4 bg-white rounded-2xl shadow hover:shadow-lg transition hover:bg-gray-200"
                  onClick={() => handleClick(group.id)}
                >
                  <h2 className="text-2xl font-bold mb-4">
                    {group.name}
                  </h2>
                  <p className="mb-4">
                    {group.description}
                  </p>
                  <ul className="flex items-center gap-1">
                    {group.players.map((player) => (
                      <li
                        key={player.player_id}
                        className="flex items-center justify-center rounded-full bg-blue-500 w-7 h-7 text-white text-sm"
                      >
                        {player.player_name
                          .toUpperCase()
                          .charAt(0)}
                      </li>
                    ))}
                  </ul>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
