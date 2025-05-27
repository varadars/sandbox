import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getPlayerHabitsAndPoints,
  PlayerChart,
} from "../components/PlayerChart";
import { Loading } from "@/components/Loading";
import { AddHabit } from "@/components/AddHabit";

type Group = {
  id: number;
  start_date: Date;
};
type Player = {
  player_id: string;
  player_name: string;
  group: Group | null;
};

type Habit = {
  id: number;
  name: string;
  description: string;
};

const PlayerDash: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const player = useRef<Player | null>(null);
  const [habits, setHabits] = useState<Habit[] | null>(
    null
  );

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const weekNumber = useRef<number | null>(null);

  useEffect(() => {
    if (!playerId) return;

    async function fetchAll() {
      try {
        await getPlayerDetails(playerId!);
        const startDate = player.current?.group?.start_date;
        if (startDate) {
          weekNumber.current = getCurrentWeek(
            new Date(startDate)
          );
        }

        const res = await getPlayerHabitsAndPoints(
          playerId!
        );
        setHabits(res.habits);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAll();
  }, [playerId]);

  async function getPlayerDetails(playerId: string) {
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
      .eq("player_id", playerId)
      .single();

    if (error) {
      console.error(error);
      return null;
    }

    if (data) {
      player.current = {
        player_id: data.player_id,
        player_name: data.player_name,
        group: data.group_id as unknown as Group,
      };

      return {
        player_id: data.player_id,
        player_name: data.player_name,
        group: data.group_id as unknown as Group,
      };
    }
    return null;
  }

  async function addHabit(data: {
    name: string;
    description: string;
  }) {
    const { name, description } = data;

    const { error } = await supabase.from("habits").insert([
      {
        player_id: playerId,
        name,
        description,
      },
    ]);

    if (error) {
      console.error("Failed to add habit:", error);
      return false;
    }

    const res = await getPlayerHabitsAndPoints(playerId!);
    setHabits(res.habits);
    setRefreshTrigger((prev) => prev + 1);

    return true;
  }

  async function completeHabit(habitId: number) {
    const now = new Date();
    const { error } = await supabase.from("points").insert([
      {
        amount: 10,
        habit_id: habitId,
        day_number: now.getDay(),
        week_number: weekNumber.current,
      },
    ]);

    if (error) {
      console.error(
        "Error marking habit complete:",
        error.message
      );
      return false;
    }
    setRefreshTrigger((prev) => prev + 1);

    return true;
  }

  function getCurrentWeek(date: Date) {
    const now = new Date();
    const startDate = new Date(date);
    const msInWeek = 1000 * 60 * 60 * 24 * 7;

    const weekNumber =
      Math.floor(
        (now.getTime() - startDate.getTime()) / msInWeek
      ) + 1;
    return weekNumber;
  }

  if (!player || !habits) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {player.current?.player_name}
        </h1>
        <div
          className="mt-5 mb-10"
          style={{ width: "100%", height: 300 }}
        >
          <PlayerChart
            playerId={playerId!}
            weekNumber={getCurrentWeek(
              player.current?.group?.start_date!
            )}
            refreshTrigger={refreshTrigger}
          />
        </div>
        <section className="bg-gray-100 shadow rounded-2xl p-6 w-full max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {habits?.map((habit) => (
              <Card
                // onDoubleClick={() =>
                //   completeHabit(habit.id)
                // }
                key={habit.id}
              >
                <CardHeader>
                  <CardTitle>{habit.name}</CardTitle>
                  <CardDescription>
                    {habit.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    onClick={() => completeHabit(habit.id)}
                  >
                    Mark as Completed
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {habits!.length < 9 && (
              <AddHabit onSubmit={addHabit} />
            )}
          </div>
        </section>
      </div>
      <div style={{ width: "100%", height: 300 }}></div>
    </div>
  );
};

export default PlayerDash;
