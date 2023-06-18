"use client";
import React, { createContext, useState, useEffect, useContext } from "react";

const SessionContext = createContext({});

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({
    players: [],
    matches: [],
    courtCount: 1,
    gameMode: "",
    name: "",
  });

  // Load state from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("session", JSON.stringify(session));
  }, [session]);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
