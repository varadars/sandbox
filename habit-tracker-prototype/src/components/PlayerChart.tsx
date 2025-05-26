import { supabase } from "../lib/client";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

const ringCount = 7;
const segmentsPerRing = 12; // Or whatever you want

const booleanRings = Array.from({ length: ringCount }, () =>
  Array.from(
    { length: segmentsPerRing },
    () => Math.random() > 0.5
  )
);

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
  dataLayers: any[];
};

export const PlayerChart: React.FC<Props> = ({
  dataLayers,
}) => {
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
            isAnimationActive={true}
          />
        ))}
      </PieChart>
    </ResponsiveContainer>
  );
};

export { getPlayerHabitsAndPoints, generateDataLayers };
