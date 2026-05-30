import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Stores/authSlice";
import logo from "../assets/Logo.webp";
import Chatbot from "../Components/ChatBot";
// ─── MainLayout ──────────────────────────────────────────────────────────────

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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* ── Header (sticky, always visible) ────────────────────────── */}
      <header
        className="flex-shrink-0 bg-primary text-white px-4 py-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000, // above Leaflet/Google Maps tiles (z-index 400)
          boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
        }}
      >
        {/* === MOBILE: Logo + Logout === */}
        <div className="flex items-center justify-between md:hidden">
          <span
            className="inline-block overflow-hidden rounded-md"
            style={{ width: "7rem", height: "3.5rem" }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "7rem",
                height: "7rem",
                objectFit: "cover",
                objectPosition: "center",
                position: "relative",
                top: "-42%",
              }}
            />
          </span>

          <button
            onClick={handleLogout}
            className="bg-primary-dark text-white px-3 py-2 rounded-full hover:bg-primary-light transition flex items-center justify-center"
            aria-label="Logout"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>

        {/* === DESKTOP: Logo === */}
        <div className="hidden md:block flex-shrink-0">
          <span
            className="inline-block overflow-hidden rounded-md"
            style={{ width: "7rem", height: "3.5rem" }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "7rem",
                height: "7rem",
                objectFit: "cover",
                objectPosition: "center",
                position: "relative",
                top: "-42%",
              }}
            />
          </span>
        </div>

        {/* === Nav links + logout (desktop) === */}
        <nav className="flex flex-row gap-2 md:gap-3 justify-center md:justify-end items-center">
          <Link
            to="/mydashboard"
            className={`
              w-full md:w-auto px-4 py-2 text-sm md:text-base text-white
              rounded-lg shadow transition text-center font-medium
              ${
                isActive("/mydashboard")
                  ? "bg-primary-light text-primary  shadow-md"
                  : "bg-primary-dark hover:bg-primary-light"
              }
            `}
          >
            My Properties
          </Link>

          <Link
            to="/alldashboard"
            className={`
              w-full md:w-auto px-4 py-2 text-sm md:text-base text-white
              rounded-lg shadow transition text-center font-medium
              ${
                isActive("/alldashboard")
                  ? "bg-primary-light text-primary  shadow-md"
                  : "bg-primary-dark hover:bg-primary-light"
              }
            `}
          >
            All Properties
          </Link>

          {/* Logout — desktop only */}
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="bg-primary-dark text-white px-3 py-2 rounded-full hover:bg-primary-light transition flex items-center justify-center"
              aria-label="Logout"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Main content (scrollable, never overlaps header/footer) ── */}
      {/*
        overflow-y-auto here means the PAGE scrolls inside this box.
        Maps rendered inside children get z-index from Leaflet (~400) which is
        safely below the header's z-index: 1000, so they won't bleed over it.
      */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>

      {/* ── Footer (sticky, always visible) ─────────────────────────── */}
      <footer
        className="flex-shrink-0 bg-gray-100 text-gray-600 py-3 text-center text-xs sm:text-sm border-t border-gray-200"
        style={{ zIndex: 100 }}
      >
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-medium text-gray-700">Gaurav Gawas</span>. All
        rights reserved.
      </footer>

      {/* ── Floating Chatbot ─────────────────────────────────────────── */}
      <Chatbot />
    </div>
  );
}
