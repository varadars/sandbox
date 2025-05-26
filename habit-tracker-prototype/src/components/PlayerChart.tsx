import { supabase } from "../lib/client";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

import { useEffect, useState } from "react";

const layers = Array.from({ length: 7 }, (_, i) => {
  const inner = i * 20;
  return {
    inner,
    outer: inner + 15,
  };
});

async function getPlayerHabitsAndPoints(playerId: string) {
  const { data: habits, error: habitsError } =
    await supabase
      .from("habits")
      .select(
        `
    id,
    name,
    description,
    points (
      id,
      day_number,
      week_number,
      created_at
    )
  `
      )
      .eq("player_id", playerId);

  if (habitsError) {
    console.error(
      "Failed to fetch habits.",
      habitsError.message
    );
    return { habits: [] };
  }
  return { habits };
}

async function generateDataLayers(
  weekNumber: number,
  playerId: string
) {
  const { habits } = await getPlayerHabitsAndPoints(
    playerId
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
        {layers.map((layer, index) => (
          <Pie
            key={index}
            data={dataLayers[index % dataLayers.length]}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={layer.inner}
            outerRadius={layer.outer}
            isAnimationActive={
              !hasMounted || refreshTrigger === 0
            }
          />
        ))}
      </PieChart>
    </ResponsiveContainer>
  );
};

export { getPlayerHabitsAndPoints, generateDataLayers };
