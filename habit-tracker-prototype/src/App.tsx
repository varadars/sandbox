import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { supabase } from "./lib/client";

function App() {
  const navigate = useNavigate();

  const [groupId, setGroupId] = useState("");
  const validateGroupId = async (e: React.FormEvent) => {
    console.log("hello");
    e.preventDefault();
    const { data, error } = await supabase
      .from("groups")
      .select(
        `id, name, description, players (player_id, player_name)`
      )
      .eq("id", groupId);

    if (error) {
      console.error(error);
    }

    if (data) {
      console.log(groupId);
      navigate(`./login?groupId=${groupId}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar></Navbar>
      <h1>Enter Group Id:</h1>
      <form onSubmit={validateGroupId}>
        <input
          placeholder="groupId"
          name="groupId"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
