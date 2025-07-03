import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../services/supabase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate("/feed");
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-xl font-bold">Log in</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="email"
          className="w-full rounded-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
        <button
          type="submit"
          className="w-full rounded bg-teal-600 py-2 text-white"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
        <p className="mt-2 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
