import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";

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

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>(); // Extracts the groupId from the URL
  const [group, setGroup] = useState<Group | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId) {
      getGroupDetails(groupId);
    }
  }, [groupId]);

  async function getGroupDetails(groupId: string) {
    const { data, error } = await supabase
      .from("groups")
      .select(
        `id, name, description, players (player_id, player_name)`
      )
      .eq("id", groupId) // Fetch the specific group by ID
      .single(); // Only expecting one result

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setGroup(data);
    }
  }

  if (!group) {
    return <div>Loading...</div>; // Simple loading state
  }

  const handleClick = (
    groupId: string,
    playerId: string
  ) => {
    navigate(`/group/${groupId}/player/${playerId}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {group.name}
        </h1>

        <section className="bg-gray-100 shadow rounded-2xl p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">
            Description
          </h2>
          <p className="mb-8">{group.description}</p>

          <h2 className="text-2xl font-semibold mb-4">
            Players
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {group.players.map((player) => (
              <li key={player.player_id}>
                <button
                  className="flex p-4 bg-white rounded-2xl shadow hover:shadow-lg transition gap-2"
                  onClick={() =>
                    handleClick(group.id, player.player_id)
                  }
                >
                  <p className="flex items-center justify-center rounded-full bg-blue-500 w-7 h-7 text-white text-sm">
                    {player.player_id}
                  </p>
                  <p>{player.player_name}</p>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default GroupPage;
