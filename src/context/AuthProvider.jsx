import { useState } from "react";
import { AuthContext } from "./auth-context";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [jwt, setJwt] = useState(JSON.parse(localStorage.getItem("jwt")));

  const login = (user) => {
    setUser(user.user);
    setIsLoggedIn(true);
    let jwt = {
      access: user.access,
      refresh: user.refresh,
    };
    setJwt(jwt);

    localStorage.setItem("user", JSON.stringify(user.user));
    localStorage.setItem("jwt", JSON.stringify(jwt));
    localStorage.setItem("isLoggedIn", "true");
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setJwt(null);

    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    localStorage.removeItem("isLoggedIn");
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    jwt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
