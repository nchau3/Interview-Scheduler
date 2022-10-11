import React, { useState, useEffect } from "react";
import axios from "axios";

export function useApplicationData(){
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({...state, day});

  //retrieve schedule data from API, set state with response data
  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then(response => {
      setState(prev => ({...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data}));
    })
  }, []);

  //update API, show new appointment upon successful save
  function bookInterview(id, interview, transition) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    axios.put(`api/appointments/${id}`, appointment)
    .then(() => setState({...state, appointments}))
    .then(() => transition("SHOW"))
    .catch((e) => {
      console.log(e);
      transition("ERROR_SAVE", true);
    })
  }

  //update API, show empty spot upon successful delete
  function cancelInterview(id, transition) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    axios.delete(`api/appointments/${id}`, appointment)
    .then(() => setState({...state, appointments}))
    .then(() => transition("EMPTY"))
    .catch((e) => {
      console.log(e);
      transition("ERROR_DELETE", true);
    })
  }

  return { state, setDay, bookInterview, cancelInterview };

}