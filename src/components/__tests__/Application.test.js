import React from "react";
import axios from "axios";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, getByTestId, getByDisplayValue } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Appointment", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"))
    .then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    })
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    //wait for API request
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    //check for transition to SAVING mode
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //appointment rendered after booking
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    //spots changed successfully
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);

    //wait for API request
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    //confirm delete
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    //check for transition to DELETING mode
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //empty spot after cancelling
    await waitForElement(() => getByText(appointment, "1pm"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    //spots changed successfully
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);

    //wait for API request
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Edit"));

    //confirm pre-filled name, change value
    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: { value: "Archibald Cohen" }
    });

    //change interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    //save new interview
    fireEvent.click(getByText(appointment, "Save"));

    //confirm saving
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    //confirm name/interviewer change
    await waitForElement(() => getByText(appointment, "Archibald Cohen"));

    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    //spots were not changed
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    const { container, debug } = render(<Application />);
    axios.put.mockRejectedValueOnce();

    //wait for API request
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //create new appointment
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    //error component render
    await waitForElement(() => getByText(container, "Error"));

    //correct message displayed
    expect(getByText(appointment, "Unable to save appointment. Please try again.")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an appointment", async () => {
    const { container, debug } = render(<Application />);
    axios.delete.mockRejectedValueOnce();

    //wait for API request
    await waitForElement(() => getByText(container, "Archie Cohen"));

    //delete appointment
    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    //confirm delete
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    //check for transition to DELETING mode
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    //error component render
    await waitForElement(() => getByText(container, "Error"));

    //correct message displayed
    expect(getByText(appointment, "Unable to delete appointment. Please try again.")).toBeInTheDocument();
  });

})
