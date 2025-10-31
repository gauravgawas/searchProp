import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../Stores/authSlice";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth);
  useEffect(() => {
    auth.token && navigate("/mydashboard");
  }, []);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Login:", { username, password });
    try {
      const response = await axios.post(auth.resourceUrl + "/api/users/login", {
        username,
        password,
      });

      // Assuming your backend sends a token or user info
      if (response.data.Status == "OK") {
        navigate("/mydashboard");
        // Save token in localStorage (optional)
        dispatch(loginSuccess({ username, token: response.data.Token }));
      } else {
        alert("Login failed!" + response.data.Message);
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-secondary-dark p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl ">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Sign In
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2  border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-2 font-semibold text-white  bg-primary hover:bg-primary-dark rounded-lg shadow-md transition-all duration-150"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-secondary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
