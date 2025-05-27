import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";
import { PlayerChart } from "../components/PlayerChart";
import { Loading } from "@/components/Loading";

type Group = {
  id: number;
  start_date: Date;
};
type Player = {
  player_id: string;
  player_name: string;
  group: Group | null;
};

const PlayerProgress: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);

  const [refreshTrigger] = useState(0);

  useEffect(() => {
    if (!playerId) return;

    async function fetchAll() {
      try {
        await getPlayerDetails(playerId!);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAll();
  }, [playerId]);

  async function getPlayerDetails(playerId: string) {
    const { data, error } = await supabase
      .from("players")
      .select(
        `
    player_id,
    player_name,
    group_id (
      id,
      start_date
    )
  `
      )
      .eq("player_id", playerId)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    if (data) {
      setPlayer({
        player_id: data.player_id,
        player_name: data.player_name,
        group: data.group_id as unknown as Group,
      });
    }
  }

  if (!player) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {player.player_name}
        </h1>
        <div className="flex flex-wrap justify-center w-[1200px] gap-y-20">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="w-1/4 p-1 text-center"
              style={{ height: 300 }}
            >
              <PlayerChart
                playerId={playerId!}
                weekNumber={index + 1}
                refreshTrigger={refreshTrigger}
              />
              <p
                className="inline-block mt-2 px-3 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--background)",
                  boxShadow:
                    "0 1px 3px var(--shadow, rgba(0,0,0,0.1))",
                }}
              >
                Week {index + 1}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: "100%", height: 300 }}></div>
    </div>
  );
};

export default PlayerProgress;
