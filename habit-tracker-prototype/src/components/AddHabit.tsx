import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export function AddHabit({
  onSubmit,
}: {
  onSubmit: (data: {
    name: string;
    description: string;
  }) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit({ name, description });
    if (success) {
      setName("");
      setDescription("");
      document.getElementById("close-dialog")?.click();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="m-0 p-0 cursor-pointer">
          <Button
            className="w-full h-full text-gray-500"
            variant="ghost"
            type="button"
            id="close-dialog"
          >
            + Add New Habit
          </Button>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
            <DialogDescription>
              Set a name and description to track daily
              progress. Max 9 habits.
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
                onChange={(e) => setName(e.target.value)}
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

          <DialogFooter>
            <Button type="submit">Add Habit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
