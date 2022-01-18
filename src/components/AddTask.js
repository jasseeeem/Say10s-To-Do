import { useState } from "react";
import { MdDone } from "react-icons/md";
import uuid from "react-uuid";

function AddTask({ onAdd }) {
  const formatDate = (d) => {
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    console.log(hours, minutes);
    return `${hours}:${minutes}`;
  };

  const [text, setText] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [time, setTime] = useState(formatTime(new Date()));
  const [subject, setSubject] = useState("cd");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      alert("Please add a task");
      return;
    }
    if (!date) {
      alert("Please add a date");
      return;
    }
    if (!time) {
      alert("Please add a time");
      return;
    }
    if (!subject) {
      alert("Pleased choose a subject");
      return;
    }
    const datestring = `${date} ${time}`;
    const parts = datestring.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/);
    let unix_timestamp = Date.UTC(
      +parts[1],
      parts[2] - 1,
      +parts[3],
      +parts[4],
      +parts[5]
    );
    unix_timestamp = unix_timestamp / 1000;
    onAdd(uuid(), text, unix_timestamp, subject);
    setText("");
    setDate(formatDate(new Date()));
    setTime(formatTime(new Date()));
    setSubject("cd");
    return;
  };

  return (
    <div className="edit-task">
      <form className="" onSubmit={onSubmit}>
        <input
          className="edit-text"
          type="text"
          placeholder="Task Name"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
        <input
          className="edit-day"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        ></input>
        <div className="flex-row">
          <input
            className="edit-day"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          ></input>
          <span className="ist">IST</span>
        </div>
        <select
          className="edit-day"
          name="subjects"
          id="subjects"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="cd">Compiler Design</option>
          <option value="cn">Computer Networks</option>
          <option value="dm">Data Mining</option>
          <option value="ml">Machine Learning</option>
          <option value="pom">Principles of Management</option>
          <option value="se">Software Engineering</option>
          <option value="mll">Machine Learning Lab</option>
          <option value="cl">Compiler Lab</option>
          <option value="nl">Networks Lab</option>
          <option value="sel">Software Engineering Lab</option>
        </select>
        <div className="sign-in">
          <button type="submit" className="middle">
            <MdDone className="tick-icon" color="white" />
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTask;
