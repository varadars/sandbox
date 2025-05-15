import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";

type Player = {
  player_id: string;
  player_name: string;
};

const PlayerDash: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (playerId) {
      getPlayerDetails(playerId);
    }
  }, [playerId]);

  async function getPlayerDetails(playerId: string) {
    const { data, error } = await supabase
      .from("players")
      .select(`player_id, player_name`)
      .eq("player_id", playerId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      setPlayer(data);
    }
  }

  if (!player) {
    return <div>Loading...</div>; // Simple loading state
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {player.player_name}
        </h1>

        <section className="bg-gray-100 shadow rounded-2xl p-6 w-full max-w-4xl"></section>
      </div>
    </div>
  );
};

export default PlayerDash;
