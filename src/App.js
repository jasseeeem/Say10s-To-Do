import Header from "./components/Header";
import Tasks from "./components/Tasks";
import Footer from "./components/Footer";
import { useState, useEffect } from "react";
import AddTask from "./components/AddTask";
import Login from "./components/Login";
import { auth } from "./services/Firebase.js";
import { firestore } from "./services/Firebase.js";

const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const compare = (a, b) => {
    if (a.deadline < b.deadline) {
      return -1;
    }
    if (a.deadline > b.deadline) {
      return 1;
    }
    return 0;
  };
  const sortTasks = (tasksToSort) => {
    return tasksToSort.sort(compare);
  };

  const Fetchdata = async () => {
    const db = firestore;
    db.collection("tasks")
      .orderBy("deadline", "asc")
      .limit(20)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((element) => {
          var data = element.data();
          data["id"] = element.id;
          setTasks((arr) => [...arr, data]);
        });
      });
  };

  useEffect(() => {
    setLoading(true);
    setTasks([]);
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) Fetchdata();
      setLoading(false);
    });
  }, []);

  //Delete Task
  const deleteTask = async (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    const db = firestore;
    db.collection("tasks").doc(id).delete();
  };

  //Edit Task
  const onEdit = async (id, text, unix_timestamp, subject) => {
    let tasksToSort = tasks.map((taskActual) =>
      taskActual.id === id
        ? {
            ...taskActual,
            text: text,
            deadline: unix_timestamp,
            subject: subject,
          }
        : taskActual
    );
    setTasks(sortTasks(tasksToSort));
    const db = firestore;
    db.collection("tasks").doc(id).update({
      text: text,
      deadline: unix_timestamp,
      subject: subject,
    });

    // sortTasks();

    return;
  };

  //Add Task
  const addTask = (id, text, unix_timestamp, subject) => {
    const db = firestore;
    db.collection("tasks").doc(id).set({
      text: text,
      deadline: unix_timestamp,
      subject: subject,
    });
    let tasksToSort = [
      ...tasks,
      { id: id, text: text, deadline: unix_timestamp, subject: subject },
    ];
    setTasks(sortTasks(tasksToSort));
    setShowAddTask(!showAddTask);
  };

  return (
    <div className="container">
      {loading ? (
        <div className="middle">
          <h3>Loading ...</h3>
        </div>
      ) : (
        <>
          <Header
            onAdd={() => setShowAddTask(!showAddTask)}
            showAdd={showAddTask}
          />
          {user ? (
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? (
                <Tasks tasks={tasks} onDelete={deleteTask} onEdit={onEdit} />
              ) : (
                "No tasks to show"
              )}
            </>
          ) : (
            <Login />
          )}
        </>
      )}
      <Footer />
    </div>
  );
};

export default App;
