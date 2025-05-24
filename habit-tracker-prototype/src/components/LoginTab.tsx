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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { useState } from "react";

import { supabase } from "../lib/client";

import { useNavigate } from "react-router-dom";

export function LoginTab() {
  const [groupId, setGroupId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const validateGroupId = async (groupId: string) => {
    const { data, error } = await supabase
      .from("groups")
      .select(
        `id, name, description, players (player_id, player_name)`
      )
      .eq("id", groupId);

    if (error) {
      console.error(error);
    }

    if (data && data.length > 0) {
      console.log(data);
      navigate(`./signup?groupId=${groupId}`);
    }
  };

  const handleLogin = async () => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.log(error);
      setErrorMsg(error.message);
      return;
    }

    const authId = data.user.id;

    const { data: player, error: playerError } =
      await supabase
        .from("players")
        .select("group_id")
        .eq("auth_id", authId)
        .single();

    if (playerError) {
      console.error(
        "Failed to fetch player:",
        playerError.message
      );
      setErrorMsg("Login succeeded, but player not found.");
      return;
    }

    navigate(`/group/${player.group_id}`);
  };

  return (
    <Tabs
      defaultValue="signin"
      className="w-[400px]"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="groupcode">
          Group Code Login
        </TabsTrigger>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
      </TabsList>

      <TabsContent value="groupcode">
        <Card>
          <CardHeader>
            <CardDescription className="italic">
              You'll need to know your group id to create an
              account and login for the first time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="group-id">Group Id</Label>
              <Input
                id="group-id"
                placeholder="123456"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => validateGroupId(groupId)}
            >
              Confirm Group
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardDescription className="italic">
              {!errorMsg && (
                <p>
                  Sign in here. Use the Group Code Login tab
                  to create your account for the first time.
                </p>
              )}
              {errorMsg && (
                <p className="text-red-500 text-sm">
                  {errorMsg}
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">New password</Label>
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
            <Button onClick={() => handleLogin()}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
