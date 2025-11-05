import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Stores/authSlice";
import logo from "../assets/Logo.png";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white p-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* === MOBILE VIEW: Logo + Logout === */}
        <div className="flex items-center justify-between md:hidden">
          {/* Logo */}
          <span
            className="inline-block overflow-hidden rounded-md"
            style={{
              width: "8rem",
              height: "4rem",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "8rem",
                height: "8rem",
                objectFit: "cover",
                objectPosition: "center",
                position: "relative",
                top: "-45%",
              }}
            />
          </span>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="bg-primary-dark text-white px-3 py-2 rounded-full hover:bg-primary-light transition flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>

        {/* === DESKTOP VIEW: Logo (Left) === */}
        <div className="hidden md:block">
          <span
            className="inline-block overflow-hidden rounded-md"
            style={{
              width: "8rem",
              height: "4rem",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "8rem",
                height: "8rem",
                objectFit: "cover",
                objectPosition: "center",
                position: "relative",
                top: "-45%",
              }}
            />
          </span>
        </div>

        {/* === Navigation (middle) === */}
        <nav className="flex flex-row gap-3 md:gap-4 justify-center md:justify-end">
          <Link
            to="/mydashboard"
            className={`w-full md:w-max bg-primary-dark px-4 py-2 text-sm md:text-base text-white rounded shadow-lg hover:bg-primary-light transition text-center ${
              isActive("/mydashboard")
                ? "bg-primary-light shadow-md"
                : "bg-primary-dark hover:bg-primary-light"
            } `}
          >
            My Dashboard
          </Link>

          <Link
            to="/alldashboard"
            className={`w-full  md:w-max bg-primary-dark px-4 py-2 text-sm md:text-base text-white rounded shadow-lg hover:bg-primary-light transition text-center ${
              isActive("/alldashboard")
                ? "bg-primary-light shadow-md"
                : "bg-primary-dark hover:bg-primary-light"
            }`}
          >
            All Dashboard
          </Link>
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="bg-primary-dark text-white px-3 py-2 rounded-full hover:bg-primary-light transition flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </nav>

        {/* === DESKTOP VIEW: Logout (Right) === */}
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-700 p-3 text-center text-sm sm:text-base">
        &copy; {new Date().getFullYear()} Gaurav Gawas. All rights reserved.
      </footer>
    </div>
  );
}
