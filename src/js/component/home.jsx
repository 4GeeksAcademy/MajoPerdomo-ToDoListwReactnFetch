import React, { useState, useEffect } from "react";

const TodoList = () => {
  const [newTask, setNewTask] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [placeholder, setPlaceholder] = useState("Qué tenemos pendiente?");
  const [taskHover, setTaskHover] = useState(null);

  const API_URL = 'https://playground.4geeks.com/apis/fake/todos/user/majopp';
  const createNewUser = () => {
    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify([]),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => {
      if (response.status === 400 || response.status === 201) {
        getTaskList();
      }
      return response.json();
    })
    .catch((error) => console.log(error));
  };

  const getTaskList = () => {
    fetch(API_URL)
    .then((response) => {
      if (response.status === 404) {
        createNewUser();
      }
      return response.json();
    })
    .then((data) => {
      setTaskList(data);
    })
    .catch((error) => console.log(error));
  };

  const addTask = (event) => {
    if (event.key === "Enter") {
      fetch(API_URL, {
        method: "PUT",
        body: JSON.stringify([...taskList, { label: newTask, done: false }]),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => response.json())
      .then((data) => {
        const updatedTaskList = Array.isArray(data) ? data : [data];
        setTaskList(updatedTaskList);
        setNewTask("");
        setPlaceholder("Qué tenemos pendiente?");
        getTaskList();
      })
      .catch((error) => console.log(error));
    }
  };

  const deleteTask = (index) => {
    fetch(API_URL, {
      method: "PUT",
      body: JSON.stringify(taskList.filter((_, i) => i !== index)),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then(() => {
      setTaskList((prevState) =>
        prevState.filter((_, i) => i !== index)
      );
      getTaskList();
    })
    .catch((error) => console.log(error));
  };

  const deleteAllTasks = () => {
    fetch(API_URL, {
      method: "PUT",
      body: JSON.stringify([{ label: "example task", done: false }]),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then((response) => response.json())
    .then(() => {
      setTaskList([]);
      getTaskList();
    })
    .catch((error) => console.log(error));
  };

  const showDelete = (index) => {
    setTaskHover(index);
  };

  const hideDelete = () => {
    setTaskHover(null);
  };

  useEffect(() => {
    getTaskList();
  }, []);

  return (
    <div className="todo-wrapper">
      <h3 className="todo-title">ToDos</h3>
      
      <div className="todo-container">
        <form>
          <div className="form-group">
            <input
              type="text"
              className="form-control p-3 rounded-0 no-outline mb-1 text-break"
              placeholder={placeholder}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={addTask}
            />

            <ul className="p-0 d-flex flex-column gap-1">
              {taskList.map((task, index) => (
                <li
                  className="p-3 m-0 d-flex justify-content-between bg-white align-items-center border text-break"
                  key={index}
                  onMouseEnter={() => showDelete(index)}
                  onMouseLeave={hideDelete}
                >
                  <span className="task-text">{task.label}</span>
                  {taskHover === index && (
                    <span 
                      className="delete-button"
                      onClick={() => deleteTask(index)}
                    >
                      X
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </form>

        <div className="todo-counter">
          {taskList.length} Items Left
        </div>
        
        <button onClick={deleteAllTasks}>Delete all tasks</button>
      </div>
    </div>
  );
};

export default TodoList;