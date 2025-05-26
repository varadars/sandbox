import { useState, useEffect } from "react";
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
  generateDataLayers,
  WeeklyProgressChart,
} from "../components/PlayerChart";

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
  const [player, setPlayer] = useState<Player | null>(null);
  const [habits, setHabits] = useState<Habit[] | null>(
    null
  );
  const [dataLayers, setDataLayers] = useState<
    any[] | null
  >(null);

  useEffect(() => {
    if (!playerId) return;

    async function fetchAll() {
      try {
        const currentPlayer: Player | null =
          await getPlayerDetails(playerId!);
        const res = await getPlayerHabitsAndPoints(
          playerId!
        );
        setHabits(res.habits);

        const weekNumber = getCurrentWeek(
          currentPlayer?.group?.start_date!
        );

        const data = await generateDataLayers(
          weekNumber,
          playerId!
        );
        setDataLayers(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
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
      setPlayer({
        player_id: data.player_id,
        player_name: data.player_name,
        group: data.group_id as unknown as Group,
      });

      return {
        player_id: data.player_id,
        player_name: data.player_name,
        group: data.group_id as unknown as Group,
      };
    }
    return null;
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

  async function completeHabit(habitId: number) {
    const currentPlayer: Player | null =
      await getPlayerDetails(playerId!);

    const startDate = new Date(
      currentPlayer!.group!.start_date
    );
    const now = new Date();

    const { error } = await supabase.from("points").insert([
      {
        amount: 10,
        habit_id: habitId,
        day_number: now.getDay(),
        week_number: getCurrentWeek(startDate!),
      },
    ]);

    if (error) {
      console.error(
        "Error marking habit complete:",
        error.message
      );
      return false;
    }

    return true;
  }

  if (!player || !dataLayers) {
    return <div>Loading...</div>;
  }

  console.log("dataLayers in render:", dataLayers);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          {player.player_name}
        </h1>
        <section
          style={{ width: "100%", height: 300 }}
          className="bg-gray-100 shadow rounded-2xl p-6 w-full max-w-4xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {habits?.map((habit) => (
              <Card key={habit.id}>
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
          </div>
        </section>
        <div>
          {dataLayers ? (
            <WeeklyProgressChart dataLayers={dataLayers} />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>
      </div>
      <div style={{ width: "100%", height: 300 }}></div>
    </div>
  );
};

export default PlayerDash;
