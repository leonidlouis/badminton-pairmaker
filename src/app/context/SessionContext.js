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
    isDouble: false,
  });

  const [shuffleResult, setShuffleResult] = useState({
    notPlaying: [],
    courts: [],
  });

  // Load state from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem("session");
    const savedShuffleResult = localStorage.getItem("shuffleResult");
    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
    if (savedShuffleResult) {
      setShuffleResult(JSON.parse(savedShuffleResult));
    }
  }, []);

  // Save session state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("session", JSON.stringify(session));
    localStorage.setItem("shuffleResult", JSON.stringify(shuffleResult));
  }, [session, shuffleResult]);

  return (
    <SessionContext.Provider
      value={{ session, setSession, shuffleResult, setShuffleResult }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
