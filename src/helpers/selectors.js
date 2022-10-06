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