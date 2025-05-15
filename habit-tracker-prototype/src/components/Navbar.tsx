import React, { useState, useEffect } from "react";
import { UserCircle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/client";

const Navbar: React.FC = () => {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } =
        await supabase.auth.getSession();
      if (error) {
        console.error(
          "Error getting session:",
          error.message
        );
      } else {
        setSession(data.session);
      }
    };

    fetchSession();

    // Optional: listen to auth changes and update session
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
    <nav className="bg-blue-600 p-4 w-full">
      <ul className="flex space-x-6">
        <li>
          <Link
            to="/"
            className="text-white text-lg hover:text-gray-300"
          >
            Home
          </Link>
        </li>
        <li className="ml-auto flex items-center space-x-4">
          {session ? (
            <>
              <Link to="/profile">
                <UserCircle
                  size={32}
                  weight="duotone"
                />
              </Link>
              <button
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
                  }
                }}
                className="text-black text-sm bg-blue-300 hover:bg-blue-800 hover:text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-white text-lg hover:text-gray-300"
            >
              Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
