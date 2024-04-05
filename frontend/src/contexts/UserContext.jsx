import { createContext, useState } from "react";
import PropTypes from 'prop-types';

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

// This is to fix the error of: children' is missing in props validationeslintreact
UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};