import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";

type Player = {
  player_id: string;
  player_name: string;
};

const PlayerProfile: React.FC = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    getPlayerProfileFromSession();
  }, []);

  async function getPlayerProfileFromSession() {
    const { data, error } =
      await supabase.auth.getSession();
    if (error) {
      setErrorMsg(error.message);
    } else {
      if (data && data.session) {
        getPlayerDetailsByAuthId(data.session?.user.id);
      }
    }
  }

  async function getPlayerDetailsByAuthId(authId: string) {
    const { data, error } = await supabase
      .from("players")
      .select(`player_id, player_name`)
      .eq("auth_id", authId)
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
        <p className="flex items-center justify-center rounded-full bg-blue-500 w-17 h-17 text-white text-xl">
          {player.player_id}
        </p>
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {player.player_name}
        </h1>
        {errorMsg && (
          <p className="text-red-600">{errorMsg}</p>
        )}
        <section className="bg-gray-100 shadow rounded-2xl p-6 w-full max-w-4xl"></section>
      </div>
    </div>
  );
};

export default PlayerProfile;
