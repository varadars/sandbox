import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { supabase } from "@/lib/client";

type AuthContextType = {
  session: any | null;
  player: any | null;
};

type Group = {
  id: number;
  start_date: Date;
};

type Player = {
  player_id: string;
  player_name: string;
  group: Group | null;
};

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [session, setSession] = useState<any>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } =
        await supabase.auth.getSession();
      if (error)
        console.error("Session error:", error.message);
      else setSession(data.session);
    };

    fetchSession();

    const { data: listener } =
      supabase.auth.onAuthStateChange(
        (_event, newSession) => {
          setSession(newSession);
        }
      );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!session?.user?.id) return;
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
        .eq("auth_id", session.user.id)
        .single();

      if (error)
        console.error("Player error:", error.message);
      else
        setPlayer({
          player_id: data.player_id,
          player_name: data.player_name,
          group: data.group_id as unknown as Group,
        });
    };

    fetchPlayer();
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, player }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  return context;
};
