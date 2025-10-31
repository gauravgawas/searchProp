import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const auth = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Sign Up:", { username, password, email });
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post(
        auth.resourceUrl + "/api/users/register",
        {
          username,
          password,
          email,
        }
      );

      // Assuming your backend sends a token or user info
      if (response.data.Status == "OK") {
        navigate("/");
        alert("Registration sucessful, you may login now!");
        // Save token in localStorage (optional)
        // localStorage.setItem("token", response.data.token);
      } else {
        alert("Registration failed!" + response.data.Message);
      }
    } catch (error: any) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      alert("Registration failed!");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-secondary-dark p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl ">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Sign Up
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
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2  border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-all bg-gray-50"
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
          {/*Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/" className="text-secondary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
