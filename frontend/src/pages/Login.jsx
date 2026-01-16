import { useState } from "react";
import API from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // 1️⃣ Call backend login API
    const response = await API.post("/auth/login", {
      email,
      password,
    });

    // 2️⃣ ✅ PUT THE LINE HERE (RIGHT AFTER LOGIN SUCCESS)
    localStorage.setItem("token", response.data.token);

    // 3️⃣ (Later) redirect user
    alert("Login successful");
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
