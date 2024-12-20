import AuthForm from "./components/AuthForm";
import { Routes, Route, Link, Navigate } from "react-router";

import Home from "./components/Home";
import useAuth from "./context/auth-context";

export default function App() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <>
      <header className="h-14">
        <nav className="fixed top-0 left-0 right-0 p-4 shadow-md bg-white">
          <ul className="flex gap-4 justify-end">
            {!isLoggedIn ? (
              <>
                <li>
                  <Link
                    className="hover:text-blue-500 font-bold transition-all"
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-blue-500 font-bold transition-all"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  className="hover:text-blue-500 font-bold transition-all"
                  onClick={logout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>

      <Routes>
        {!isLoggedIn && (
          <>
            <Route path="/register" element={<AuthForm mode="register" />} />
            <Route path="/login" element={<AuthForm mode="login" />} />
          </>
        )}
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
