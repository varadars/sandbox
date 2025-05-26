import { supabase } from "../lib/client";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
} from "recharts";

const layers = Array.from({ length: 7 }, (_, i) => {
  const inner = i * 20;
  return {
    inner,
    outer: inner + 15,
  };
});

const sampleDataLayers = [
  [
    { value: 1, fill: "var(--primary)" },
    { value: 1, fill: "#fff" },
    { value: 1, fill: "var(--primary)" },
    { value: 1, fill: "#fff" },
    { value: 1, fill: "var(--primary)" },
    { value: 1, fill: "#fff" },
    { value: 1, fill: "var(--primary)" },
  ],
  [
    { value: 1, fill: "#fff" },
    { value: 1, fill: "var(--primary)" },
    { value: 1, fill: "#fff" },
    { value: 1, fill: "var(--primary)" },
    { value: 1, fill: "#fff" },
    { value: 1, fill: "var(--primary)" },
    { value: 1, fill: "#fff" },
  ],
];

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

  return habits.map((habit) => {
    const segments = Array(7)
      .fill(null)
      .map((_, dayNumber) => {
        const pointExists = habit.points.some(
          (point) =>
            point.day_number === dayNumber &&
            point.week_number === weekNumber
        );

        return {
          value: 1,
          fill: pointExists ? "var(--primary)" : "#fff",
        };
      });

    return segments;
  });
}

type Props = {
  dataLayers: any[];
};

export const WeeklyProgressChart: React.FC<Props> = ({
  dataLayers,
}) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        {sampleDataLayers.map((layerData, index) => (
          <Pie
            key={index}
            data={layerData}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={layers[index]?.inner || 0}
            outerRadius={layers[index]?.outer || 0}
            isAnimationActive={false}
          />
        ))}
      </PieChart>
    </ResponsiveContainer>
  );
};

export { getPlayerHabitsAndPoints, generateDataLayers };
