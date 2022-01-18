import { FaTrash } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { useState } from "react";
import EditTask from "./EditTask";

function Task({ task, onDelete, onEdit }) {
  const [editFlag, setEditFlag] = useState(true);

  const invertEdit = () => {
    setEditFlag(!editFlag);
  };

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const map = {
    cd: "Compiler Design",
    cn: "Computer Networks",
    dm: "Data Mining",
    ml: "Machine Learning",
    pom: "Principles of Management",
    se: "Software Engineering",
    mll: "Machine Learning Lab",
    cl: "Compiler Lab",
    nl: "Networks Lab",
    sel: "Software Engineering Lab",
  };

  const formatDate = (unix_timestamp) => {
    const date = new Date(unix_timestamp * 1000);
    const day = days[date.getUTCDay()];
    const month = months[date.getUTCMonth()];
    const date_ = date.getUTCDate();
    const year = date.getUTCFullYear();
    return `${day}, ${date_} ${month} ${year}`;
  };

  const formatTime = (unix_timestamp) => {
    const date = new Date(unix_timestamp * 1000);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  };

  if (editFlag) {
    return (
      <div className={`task ${task.reminder ? "reminder" : ""}`}>
        <div className="left-side">
          <h3>{task.text}</h3>
          <p>{formatTime(task.deadline)} IST</p>
          <p>{formatDate(task.deadline)}</p>
          <div>
            <button className="badge">{map[task.subject]}</button>
          </div>
        </div>
        <div className="right-side">
          <FaPencilAlt
            className="icons"
            onClick={() => invertEdit(task.id)}
            style={{ color: "green", cursor: "pointer" }}
          />
          <FaTrash
            className="icons"
            onClick={() => onDelete(task.id)}
            style={{ color: "red", cursor: "pointer" }}
          />
        </div>
      </div>
    );
  } else {
    return <EditTask task={task} onEdit={onEdit} invertEdit={invertEdit} />;
  }
}

export default Task;
