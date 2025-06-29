import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { ChartDonut } from "@phosphor-icons/react";
import { LoginTab } from "@/components/LoginTab";
import { useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/lib/client";

type Player = {
  player_id: string;
  player_name: string;
  group_id: string;
};

function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [player, setPlayer] = useState<Player>();

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("players")
        .select(`player_id, player_name, group_id`)
        .eq("auth_id", session.user.id)
        .single();

      if (error) {
        console.error(
          "Error fetching player:",
          error.message
        );
      } else {
        setPlayer(data);
      }
    };

    fetchPlayer();
  }, [session]);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } =
        await supabase.auth.getSession();
      if (error)
        console.error(
          "Error getting session:",
          error.message
        );
      else setSession(data.session);
    };

    fetchSession();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (player) {
      navigate(
        `/group/${player.group_id}/player/${player.player_id}`
      );
    }
  }, [player, navigate]);

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
      <Toaster richColors />
    </div>
  );
}

export default App;
