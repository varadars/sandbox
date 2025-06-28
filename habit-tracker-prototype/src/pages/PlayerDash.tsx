import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  getPlayerHabitCompletion,
  PlayerChart,
} from "../components/PlayerChart";
import { Loading } from "@/components/Loading";
import { AddHabit } from "@/components/AddHabit";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckFat } from "@phosphor-icons/react";

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
  completed: boolean;
};

const PlayerDash: React.FC = () => {
  const navigate = useNavigate();
  const { playerId } = useParams<{ playerId: string }>();
  const player = useRef<Player | null>(null);
  const [habits, setHabits] = useState<Habit[] | null>(
    null
  );
  const [selectedHabit, setSelectedHabit] =
    useState<Habit | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);

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

        const res = await getPlayerHabitCompletion(
          playerId!,
          weekNumber.current!
        );
        setHabits(res);
      } catch (error) {
        console.error(error);
      }
    }

    fetchAll();
  }, [playerId]);

  function openEditDialog(habit: Habit) {
    setSelectedHabit(habit);
    setName(habit.name);
    setDescription(habit.description || "");
  }

  function clearDialog() {
    setSelectedHabit(null);
    setName("");
    setDescription("");
  }

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

      //if there are any errors fetching the player navigate to home
      navigate("/");
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

    const res = await getPlayerHabitCompletion(
      playerId!,
      weekNumber.current!
    );
    setHabits(res);
    setRefreshTrigger((prev) => prev + 1);

    return true;
  }
  async function editHabit(
    id: number,
    name: string,
    description: string
  ) {
    const { error } = await supabase
      .from("habits")
      .update({ name, description })
      .eq("id", id);

    if (error) {
      console.error(
        "Failed to update habit:",
        error.message
      );
    } else {
      const res = await getPlayerHabitCompletion(
        playerId!,
        weekNumber.current!
      );
      setHabits(res);
    }
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
    const res = await getPlayerHabitCompletion(
      playerId!,
      weekNumber.current!
    );
    setHabits(res);
    setRefreshTrigger((prev) => prev + 1);

    return true;
  }
  async function deleteHabit(id: number) {
    const { error } = await supabase
      .from("habits")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Failed to delete habit:",
        error.message
      );
    } else {
      const res = await getPlayerHabitCompletion(
        playerId!,
        weekNumber.current!
      );
      setHabits(res);
      setRefreshTrigger((prev) => prev + 1);
    }
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
      <div className="h-15"></div>
      <div className="flex flex-col items-center justify-center mt-12">
        <h1 className="text-4xl font-bold text-blue-600">
          {player.current?.player_name}
        </h1>
        <p
          className="inline-block mt-2 px-3 py-1 rounded-md text-xs font-medium  mb-6"
          style={{
            backgroundColor: "var(--secondary)",
            color: "var(--primary)",
            boxShadow:
              "0 1px 3px var(--shadow, rgba(0,0,0,0.1))",
          }}
        >
          Week {weekNumber.current}
        </p>
        <div
          className="mt-5 mb-10 text-center"
          style={{ width: "100%", height: 315 }}
        >
          <PlayerChart
            playerId={playerId!}
            weekNumber={getCurrentWeek(
              player.current?.group?.start_date!
            )}
            refreshTrigger={refreshTrigger}
          />
        </div>
        <Card
          className="@container/card mb-8 p-8 w-full max-w-6xl"
          style={{ background: "var(--secondary)" }}
          data-slot="card"
        >
          <CardHeader className="p-1 m-0">
            <CardTitle className="text-2xl font-semibold">
              Today's Habits
            </CardTitle>
            <CardDescription>
              Double-click the habit to edit or delete.
            </CardDescription>
          </CardHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {habits.map((habit) => (
              <Dialog
                key={habit.id}
                open={selectedHabit?.id === habit.id}
                onOpenChange={(open) =>
                  !open && clearDialog()
                }
              >
                <DialogTrigger asChild>
                  <DialogTrigger asChild>
                    <Card
                      className="cursor-pointer"
                      onDoubleClick={() =>
                        openEditDialog(habit)
                      }
                    >
                      <CardHeader>
                        <CardTitle>{habit.name}</CardTitle>
                        <CardDescription>
                          {habit.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter
                        className={
                          habit.completed
                            ? ""
                            : "flex items-center justify-between gap-4"
                        }
                      >
                        <p
                          className="px-3 py-1 rounded-sm text-sm font-medium"
                          style={{
                            backgroundColor:
                              "var(--secondary)",
                            color: "var(--primary)",
                            boxShadow:
                              "0 1px 3px var(--shadow, rgba(0,0,0,0.1))",
                          }}
                        >
                          {habit.completed
                            ? "Completed"
                            : "Incomplete"}
                        </p>
                        {!habit.completed && (
                          <Button
                            className="h-auto px-0 py-2 rounded-xl"
                            onClick={() =>
                              completeHabit(habit.id)
                            }
                          >
                            <CheckFat
                              className="mx-0"
                              size={16}
                            />
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </DialogTrigger>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[425px]">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      editHabit(
                        habit.id,
                        name,
                        description
                      );
                      clearDialog();
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Habit</DialogTitle>
                      <DialogDescription>
                        Update the name or description, or
                        delete your habit.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="name"
                          className="text-right"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          value={name}
                          onChange={(e) =>
                            setName(e.target.value)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label
                          htmlFor="description"
                          className="text-right"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          className="col-span-3 resize-none"
                          rows={4}
                          value={description}
                          onChange={(e) =>
                            setDescription(e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex justify-between">
                      <Button type="submit">
                        Save Changes
                      </Button>
                      <>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() =>
                            setShowConfirm(true)
                          }
                        >
                          Delete
                        </Button>

                        <Dialog
                          open={showConfirm}
                          onOpenChange={setShowConfirm}
                        >
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                Confirm Deletion
                              </DialogTitle>
                              <DialogDescription>
                                Are you absolutely sure you
                                want to delete this habit?
                                All associated data will be
                                lost forever.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="flex justify-end gap-4 mt-4">
                              <Button
                                variant="ghost"
                                onClick={() =>
                                  setShowConfirm(false)
                                }
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  deleteHabit(habit.id);
                                  clearDialog(); // your close form dialog function
                                  setShowConfirm(false);
                                }}
                              >
                                Yes, Delete
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ))}

            {habits!.length < 9 && (
              <AddHabit onSubmit={addHabit} />
            )}
          </div>
        </Card>
      </div>
      <div style={{ width: "100%", height: 300 }}></div>
    </div>
  );
};

export default PlayerDash;
