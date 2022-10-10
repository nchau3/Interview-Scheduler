export function getAppointmentsForDay(state, day){
  const { days, appointments } = state;
  let appointmentsForDay = [];
  for (let d of days) {
    if (d.name === day) {
      Object.values(appointments).forEach((app, i) => {
        if (d.appointments.includes(i + 1)) {
          appointmentsForDay.push(app);
        }
      });
    }
  }
  return appointmentsForDay;
}

export function getInterviewersForDay(state, day){
  const { days, interviewers } = state;
  let interviewersForDay = [];
  for (let d of days) {
    if (d.name === day) {
      Object.values(interviewers).forEach((interviewer) => {
        if (d.interviewers.includes(interviewer.id)) {
          interviewersForDay.push(interviewer);
        }
      });
    }
  }
  return interviewersForDay;
}

export function getInterview(state, interview){
  if (!interview) {
    return null
  }
  const { interviewers } = state;
  const { interviewer, student } = interview;
  if (interviewers[interviewer]) {
    return {
      student: student,
      interviewer: interviewers[interviewer]
    }
  }
}