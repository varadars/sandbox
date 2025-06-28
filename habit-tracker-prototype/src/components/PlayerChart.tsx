import { supabase } from "../lib/client";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Label,
} from "recharts";

import { useEffect, useState } from "react";

async function getPlayerHabits(playerId: string) {
  const { data: habits, error: habitsError } =
    await supabase
      .from("habits")
      .select("id, name, description")
      .eq("player_id", playerId)
      .order("id");

  if (habitsError || !habits) {
    console.error(
      "Failed to fetch habits.",
      habitsError?.message
    );
    return [];
  }

  return habits;
}

async function getPlayerHabitCompletion(
  playerId: string,
  weekNumber: number
) {
  const dayNumber = new Date().getDay();

  const { data: habits, error: habitsError } =
    await supabase
      .from("habits")
      .select("id, name, description")
      .eq("player_id", playerId)
      .order("id");

  if (habitsError || !habits) {
    console.error(
      "Failed to fetch habits.",
      habitsError?.message
    );
    return [];
  }

  const habitIds = habits.map((h) => h.id);

  const { data: completions, error: completionsError } =
    await supabase
      .from("points")
      .select("habit_id")
      .in("habit_id", habitIds)
      .eq("week_number", weekNumber)
      .eq("day_number", dayNumber);

  if (completionsError || !completions) {
    console.error(
      "Failed to fetch completions.",
      completionsError?.message
    );
    return habits.map((habit) => ({
      ...habit,
      completed: false,
    }));
  }

  const completedIds = new Set(
    completions.map((c) => c.habit_id)
  );

  return habits
    .sort(
      (a, b) =>
        Number(completedIds.has(a.id)) -
        Number(completedIds.has(b.id))
    )
    .map((habit) => ({
      ...habit,
      completed: completedIds.has(habit.id),
    }));
}

async function getPlayerPointsByWeek(
  playerId: string,
  weekNumber: number
) {
  const { data: habits, error: habitsError } =
    await supabase
      .from("habits")
      .select("id, name, description")
      .eq("player_id", playerId);

  if (habitsError || !habits) {
    console.error(
      "Failed to fetch habits.",
      habitsError?.message
    );
    return [];
  }

  const habitIds = habits.map((h) => h.id);

  const { data: points, error: pointsError } =
    await supabase
      .from("points")
      .select("id, habit_id, day_number, week_number")
      .in("habit_id", habitIds)
      .eq("week_number", weekNumber);

  if (pointsError || !points) {
    console.error(
      "Failed to fetch points.",
      pointsError?.message
    );
    return [];
  }

  const habitsWithPoints = habits.map((habit) => ({
    ...habit,
    points: points.filter((p) => p.habit_id === habit.id),
  }));

  return habitsWithPoints;
}

async function generateDataLayers(
  weekNumber: number,
  playerId: string
) {
  const habits = await getPlayerPointsByWeek(
    playerId,
    weekNumber
  );

  const layers = Array.from(
    { length: 7 },
    (_, dayNumber) => {
      return habits.map((habit) => {
        const pointExists = habit.points.some(
          (point) =>
            point.day_number === dayNumber &&
            point.week_number === weekNumber
        );

        return {
          name: habit.name,
          value: 1,
          fill: pointExists
            ? "var(--primary)"
            : "var(--secondary)",
        };
      });
    }
  );

  return layers;
}

type Props = {
  playerId: string;
  weekNumber: number;
  refreshTrigger: number;
};

export const PlayerChart: React.FC<Props> = ({
  playerId,
  weekNumber,
  refreshTrigger,
}) => {
  const [dataLayers, setDataLayers] = useState<any[][]>([]);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    async function loadData() {
      const layers = await generateDataLayers(
        weekNumber,
        playerId
      );
      setDataLayers(layers);
    }
    loadData();
  }, [playerId, weekNumber, refreshTrigger]);

  useEffect(() => {
    const timeout = setTimeout(
      () => setHasMounted(true),
      300
    );
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        {dataLayers.map((layerData, index) => {
          const inner = index * 18 + 30;
          const outer = inner + 13;

          return (
            <Pie
              key={index}
              data={layerData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={inner}
              outerRadius={outer}
              paddingAngle={2}
              isAnimationActive={
                !hasMounted || refreshTrigger === 0
              }
            >
              {/* <Label
                width={40}
                position="center"
                className="text-xl"
              >
                Sustainability
              </Label> */}
            </Pie>
          );
        })}
        <Tooltip
          content={({ payload, label, active }) => {
            if (!active || !payload?.length) return null;

            return (
              <div className="rounded-lg border bg-white p-2 shadow text-sm">
                <p className="font-medium">{label}</p>
                {payload.map((entry) => (
                  <p
                    key={entry.name}
                    className="text-muted-foreground"
                  >
                    {entry.name}
                  </p>
                ))}
              </div>
            );
          }}
          cursor={{ fill: "transparent" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export {
  getPlayerPointsByWeek,
  getPlayerHabitCompletion,
  generateDataLayers,
};
