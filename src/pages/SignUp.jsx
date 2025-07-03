import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../services/supabase";

function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error("Signup failed");

      const { error: profileError } = await supabase.from("profiles").insert([
        {
          user_id: data.user.id,
          fullName,
          email: data.user.email,
        },
      ]);

      if (profileError) throw profileError;

      navigate("/feed");
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-4 text-xl font-bold">Sign up</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          className="w-full rounded-full border p-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
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
          {loading ? "Creating account..." : "Sign up"}
        </button>
        <p className="mt-2 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
