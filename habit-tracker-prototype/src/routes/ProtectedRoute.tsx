import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { supabase } from "../lib/client";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loading } from "@/components/Loading";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { groupId } = useParams<{ groupId: string }>();
  const [session, setSession] = useState<Session | null>(
    null
  );
  const [player, setPlayer] = useState<any>(null);

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
  }, []);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("players")
        .select(`group_id`)
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

  if (!player) return <Loading />;

  return player.group_id !== Number(groupId) ? (
    <Navigate
      to={`/group/${player.group_id}`}
      replace
    />
  ) : (
    children
  );
}
