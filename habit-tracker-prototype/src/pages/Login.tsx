import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/client";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    console.log(data);

    if (error) {
      setErrorMsg(error.message);
    } else {
      const insertError = await supabase
        .from("players")
        .insert({
          auth_id: data.user.id,
        });

      if (insertError.error) {
        console.error(
          "Insert failed:",
          insertError.error.message
        );
        setErrorMsg(
          "Signup succeeded but player record failed."
        );
      } else {
        navigate("/"); // or welcome screen
      }
      navigate("/");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded shadow-md w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          {errorMsg && (
            <p className="text-red-500 text-sm">
              {errorMsg}
            </p>
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-3 py-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
