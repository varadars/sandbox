import { useNavigate } from "react-router-dom";
import { UserCircle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/client";
import { useAuth } from "@/components/AuthContext";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { session, player } = useAuth();

  return (
    <nav className="w-full bg-primary px-6 py-4 text-primary-foreground shadow">
      <ul className="flex items-center gap-6">
        <li>
          <Link
            to={
              session && player
                ? `/group/${player.group.id}`
                : "/"
            }
            className="text-xl font-semibold hover:underline hover:opacity-80"
          >
            {session && player ? "My Group" : "Home"}
          </Link>
        </li>
        <li>
          {session && player && (
            <Link
              to={`/group/${player.group.id}/player/${player.player_id}/progress`}
              className="text-xl font-semibold hover:underline hover:opacity-80"
            >
              My Progress
            </Link>
          )}
        </li>
        <li className="ml-auto flex items-center gap-4">
          {session ? (
            <>
              <Link
                to={
                  session && player
                    ? `/group/${player.group.id}/player/${player.player_id}`
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
