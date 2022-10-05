import React from "react";
import "./InterviewerListItem.scss";
import classNames from "classnames";

export default function InterviewerListItem(props) {
const itemClasses = classNames(
  {"interviewers__item": !props.selected},
  {"interviewers__item--selected": props.selected}
);

  return (
<li className={itemClasses}
onClick={() => props.setInterviewer(props.id)}>
  <img
    className="interviewers__item-image"
    src={props.avatar}
    alt={props.name}
  />
  {props.selected && props.name}
</li>
  );
}