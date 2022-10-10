import React, { useState } from "react";

export default function useVisualMode(initial){
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    if (replace === true) {
      setHistory(prev => {
        prev.splice(-1, newMode);
        return prev;
      })
    } else {
      setHistory(prev => [...prev, newMode]);
    }
  }

  function back(){
    if (history.length > 1) {
      setHistory(prev => {
        prev.splice(-1);
        setMode(prev[prev.length - 1]);
        return prev;
      });
    }
  };

  return { mode, transition, back };
}