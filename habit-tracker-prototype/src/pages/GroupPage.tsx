import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {group.name}
        </h1>

        <section className="bg-gray-100 shadow rounded-2xl p-6 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4">
            Description
          </h2>
          <p className="mb-8">{group.description}</p>

          <h2 className="text-2xl font-semibold mb-4">
            Players
          </h2>
          <ul className="flex gap-4">
            {group.players.map((player) => (
              <li key={player.player_id}>
                <Button
                  variant="outline"
                  className="rounded-lg"
                  onClick={() =>
                    handleClick(group.id, player.player_id)
                  }
                >
                  <UserCircle
                    color="var(--primary)"
                    weight="duotone"
                    className="w-15 h-15 m-0 p-0"
                  />
                  <span className="text-md">
                    {player.player_name}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Leaderboard
          </h2>
          <div
            className="mt-5 mb-10"
            style={{ width: "100%", height: 300 }}
          >
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
                  content={({ payload, label, active }) => {
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
        </section>
        <div className="h-[300px]"></div>
      </div>
    </div>
  );
};

export default GroupPage;
