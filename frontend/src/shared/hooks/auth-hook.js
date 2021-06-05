import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsloggedIn] = useState(null);
  const [tokenExpirationTime, setTokenExpirationTime] = useState(null);

  const login = useCallback(({ creatorId, token, expiration }) => {
    const tokenExpiration =
      expiration || new Date(new Date().getTime() + 1000 * 60 * 60);

    setIsloggedIn({ creatorId: creatorId, token: token });
    setTokenExpirationTime(tokenExpiration);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        creatorId: creatorId,
        token: token,
        expiration: tokenExpiration,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setIsloggedIn(null);
    setTokenExpirationTime(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    let logoutTimer;

    if (isLoggedIn && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [isLoggedIn, logout, tokenExpirationTime]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    )
      setIsloggedIn({
        creatorId: storedData.creatorId,
        token: storedData.token,
        expiration: new Date(storedData.expiration),
      });
  }, []);

  return [isLoggedIn, login, logout];
};
