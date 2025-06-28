import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");

  const handleSignup = async () => {
    //validate email, validate pwd, validate username
    //deal with plus addressing on emails
    const { data: auth, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      setErrorMsg(authError.message);
      return;
    } else if (auth) {
      const { error: playerError } = await supabase
        .from("players")
        .insert({
          auth_id: auth.user!.id,
          group_id: groupId,
          player_name: username,
          email: email,
        });

      if (playerError) {
        console.error(
          "Insert failed:",
          playerError.message
        );
        setErrorMsg("Signup failed, please try again.");

        await fetch(
          `https://${
            import.meta.env.VITE_PROJECT_REF
          }.functions.supabase.co/delete-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                import.meta.env.VITE_SUPABASE_ANON_KEY
              }`,
            },
            body: JSON.stringify({
              auth_id: auth.user!.id,
            }),
          }
        );
      } else {
        navigate(`/`);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-[400px] mx-auto my-50">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription className="italic">
              {!errorMsg && (
                <div>
                  <Link
                    to="/"
                    className="text-blue-600 hover:underline"
                  >
                    Already have an account?
                  </Link>
                </div>
              )}
              {errorMsg && (
                <p className="text-red-500 text-sm">
                  {errorMsg}
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSignup()}>
              Signup
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Signup;
