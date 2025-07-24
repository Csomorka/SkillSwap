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
    <div className="min-h-screen bg-white px-4 pt-4 sm:pt-12">
      <div className="mx-auto w-full max-w-md">
        {/* Logo and Header */}
        <div className="flex flex-col items-center">
          <img
            src="/SkillSwapLogo.png"
            alt="Logo"
            className="h-36 w-36 object-contain"
          />
          <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:text-3xl">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">Log in to your account</p>
        </div>

        {/* Form Card */}
        <div className="mt-6 rounded-xl border border-gray-200 p-6 shadow-sm sm:p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errorMsg && (
              <p className="text-center text-sm text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-amber-400 py-3 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="pt-6 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-amber-500 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="mx-auto max-w-md p-6">
  //     <h1 className="mb-4 text-xl font-bold">Log in</h1>
  //     <form onSubmit={handleLogin} className="space-y-4">
  //       <input
  //         type="email"
  //         placeholder="email"
  //         className="w-full rounded-full border p-2"
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //         required
  //       />
  //       <input
  //         type="password"
  //         placeholder="Password"
  //         className="w-full rounded-full border p-2"
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //         required
  //       />
  //       {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
  //       <button
  //         type="submit"
  //         className="w-full rounded bg-teal-600 py-2 text-white"
  //         disabled={loading}
  //       >
  //         {loading ? "Logging in..." : "Log in"}
  //       </button>
  //       <p className="mt-2 text-sm">
  //         Don’t have an account?{" "}
  //         <Link to="/signup" className="text-blue-500">
  //           Sign up
  //         </Link>
  //       </p>
  //     </form>
  //   </div>
  // );
}

export default Login;
