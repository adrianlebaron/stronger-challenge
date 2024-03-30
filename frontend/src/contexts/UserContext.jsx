import { createContext, useState } from "react";

export const UserContext = createContext();

// This context provider is passed to any component requiring the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
