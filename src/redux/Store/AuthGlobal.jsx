import React from "react";

const AuthGlobal = React.createContext({
  stateUser: {
    isAuthenticated: null,
    user: {},
    userProfile: null,
    isLoading: true,
  },
  dispatch: () => {},
});

export default AuthGlobal;
