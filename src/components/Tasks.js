import Task from "./Task";

const Tasks = ({ tasks, onDelete, onEdit }) => {
  var currentTime = new Date();
  var ISTOffset = 330; // IST offset UTC +5:30
  var ISTTime = new Date(currentTime.getTime() + ISTOffset * 60000);
  ISTTime = +ISTTime / 1000;
  console.log(ISTTime);
  return (
    <>
      <h3 style={{ color: "orangered" }}>UPCOMING TASKS</h3>
      {tasks.map(
        (task) =>
          task.deadline > ISTTime && (
            <Task
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          )
      )}
      <h3 style={{ color: "green" }}>TASKS DONE</h3>
      {tasks.map(
        (task) =>
          task.deadline <= ISTTime && (
            <Task
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          )
      )}
    </>
  );
};

export default Tasks;
