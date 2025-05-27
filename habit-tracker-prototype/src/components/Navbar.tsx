import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/client";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [player, setPlayer] = useState<any>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!session?.user?.id) return;
      const { data, error } = await supabase
        .from("players")
        .select(`player_id, group_id`)
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

  return (
    <nav className="w-full bg-primary px-6 py-4 text-primary-foreground shadow">
      <ul className="flex items-center gap-6">
        <li>
          <Link
            to={
              session && player
                ? `/group/${player.group_id}`
                : "/"
            }
            className="text-xl font-semibold hover:underline hover:opacity-80"
          >
            Home
          </Link>
        </li>
        <li className="ml-auto flex items-center gap-4">
          {session ? (
            <>
              <Link
                to={
                  session && player
                    ? `/group/${player.group_id}/player/${player.player_id}`
                    : "/"
                }
                aria-label="Profile"
              >
                <UserCircle
                  size={32}
                  weight="duotone"
                />
              </Link>
              <Button
                variant="secondary"
                onClick={async () => {
                  const { error } =
                    await supabase.auth.signOut();
                  if (error) {
                    console.error(
                      "Logout error:",
                      error.message
                    );
                  } else {
                    setSession(null);
                    navigate("/");
                  }
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <></>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
