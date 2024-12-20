import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: {},
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  jwt: {},
});

export default function useAuth() {
  return useContext(AuthContext);
}
