import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle } from "@phosphor-icons/react";

type Player = {
  player_id: string;
  player_name: string;
};

type Group = {
  id: string;
  name: string;
  description: string;
  players: Player[];
};

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>(); // Extracts the groupId from the URL
  const [group, setGroup] = useState<Group | null>(null);
  const navigate = useNavigate();
  const [playerPointSums, setPlayerPointSums] = useState<
    any | null
  >(null);

  useEffect(() => {
    if (groupId) {
      getGroupDetails(groupId);
    }
  }, [groupId]);

  async function getGroupDetails(groupId: string) {
    const { data, error } = await supabase
      .from("groups")
      .select(
        `
    id,
    name,
    description,
    players (
      player_id,
      player_name,
      habits (
        id,
        points (amount)
      )
    )
  `
      )
      .eq("id", groupId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const playerPointSums = data.players.map((player) => {
        const totalPoints = player.habits
          .flatMap((habit) => habit.points)
          .reduce((sum, point) => sum + point.amount, 0);
        return {
          player_id: player.player_id,
          player_name: player.player_name,
          totalPoints,
        };
      });
      const chartData = playerPointSums
        .map((p) => ({
          name: p.player_name,
          uv: p.totalPoints,
        }))
        .sort((a, b) => b.uv - a.uv);
      setPlayerPointSums(chartData);
      setGroup(data);
    }
  }

  if (!group) {
    return <div>Loading...</div>;
  }

  const handleClick = (
    groupId: string,
    playerId: string
  ) => {
    navigate(`/group/${groupId}/player/${playerId}`);
  };

  const totalPlayers = group.players.length;
  const topPlayer =
    playerPointSums.length > 0 ? playerPointSums[0] : null;
  const totalPoints = playerPointSums.reduce(
    (sum: number, player: any) => sum + player.uv,
    0
  );
  const averagePoints =
    totalPlayers > 0
      ? Math.round(totalPoints / totalPlayers)
      : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12 px-4">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {group.name}
        </h1>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full max-w-6xl mb-8">
          {" "}
          <Card className="">
            <CardHeader className="relative">
              <CardDescription>
                Total Players
              </CardDescription>
              <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
                {totalPlayers}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Active members
              </div>
              <div className="text-muted-foreground">
                Engaged community
              </div>
            </CardFooter>
          </Card>
          <Card className="">
            <CardHeader className="relative">
              <CardDescription>
                Total Points
              </CardDescription>
              <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
                {totalPoints.toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Combined score
              </div>
              <div className="text-muted-foreground">
                Group performance
              </div>
            </CardFooter>
          </Card>
          <Card className="">
            <CardHeader className="relative">
              <CardDescription>
                Average Points
              </CardDescription>
              <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
                {averagePoints}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Per player average
              </div>
              <div className="text-muted-foreground">
                Skill level indicator
              </div>
            </CardFooter>
          </Card>
          <Card className="">
            <CardHeader className="relative">
              <CardDescription>Top Player</CardDescription>
              <CardTitle className="text-2xl md:text-3xl font-semibold tabular-nums">
                {topPlayer ? topPlayer.uv : 0}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {topPlayer ? topPlayer.name : "No data"}
              </div>
              <div className="text-muted-foreground">
                Leading performance
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Leaderboard Card */}
        <Card
          className="@container/card mb-8 w-full max-w-6xl "
          data-slot="card"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Leaderboard
            </CardTitle>
            <CardDescription>
              Performance comparison across all players
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="w-full h-[300px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  width={150}
                  height={40}
                  data={playerPointSums}
                >
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                  />
                  <Tooltip
                    content={({
                      payload,
                      label,
                      active,
                    }) => {
                      if (!active || !payload?.length)
                        return null;

                      return (
                        <div className="rounded-lg border bg-white p-2 shadow text-sm">
                          <p className="font-medium">
                            {label}
                          </p>
                          {payload.map((entry) => (
                            <p
                              key={entry.name}
                              className="text-muted-foreground"
                            >
                              {entry.name}: {entry.value}
                            </p>
                          ))}
                        </div>
                      );
                    }}
                    cursor={{ fill: "transparent" }}
                  />
                  <Bar
                    dataKey="uv"
                    name="Total Points"
                    fill="var(--primary)"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    activeBar={
                      <Rectangle
                        fill="var(--primary)"
                        stroke="black"
                      />
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardFooter>
        </Card>
        {/* Players Card */}
        <Card
          className="@container/card mb-8 w-full max-w-6xl "
          data-slot="card"
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Players
            </CardTitle>
            <CardDescription>
              Access individual player data
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-0">
            <div className="flex flex-wrap gap-4 w-full">
              {group.players.map((player) => (
                <Button
                  key={player.player_id}
                  variant="outline"
                  className="rounded-lg flex items-center gap-2"
                  onClick={() =>
                    handleClick(group.id, player.player_id)
                  }
                >
                  <UserCircle
                    color="var(--primary)"
                    weight="duotone"
                    className="w-5 h-5"
                  />
                  <span className="text-md">
                    {player.player_name}
                  </span>
                </Button>
              ))}
            </div>
          </CardFooter>
        </Card>
        <div className="h-[100px]"></div>
      </div>
    </div>
  );
};
export default GroupPage;
