import { useState } from "react";
import { Task } from "./Task";

export const Todo = () => {
    const [todoList, setTodoList] = useState([]);
    const [newTask, setNewTask] = useState("");

    const handleNewTask = (event) => {
        setNewTask(event.target.value);
    };

    const addTask = () => {
        const task = {
            id: todoList.length > 0 ? todoList[todoList.length - 1].id + 1 : 1,
            taskName: newTask,
            completed: false
        }
        setTodoList([...todoList, task]);
    };

    const deleteTask = (id) => {
        setTodoList(todoList.filter((task) => task.id !== id));
    };

    const completeTask = (id) => {
        setTodoList(todoList.map((task) => {
            if (task.id === id) {
                return { ...task, completed: true };
            }
            return task;
        }));
    }

    return (
        <>
            <div className="todo container">
                <h1>Todo List App</h1>
                <div>
                    <input
                        onChange={handleNewTask}
                        className="input"
                        type="text"
                        placeholder="Enter a new task"
                    />
                    <button
                        onClick={addTask}
                        className="btn inc-btn">
                        Add Task
                    </button>
                </div>

                <div className="tasks-container">
                    <h2>Tasks:</h2>
                    <div className="tasks-container">
                        {todoList.map((task, key) => {
                            return (
                                <Task key={key}
                                    taskName={task.taskName}
                                    id={task.id}
                                    completed={task.completed}
                                    deleteTask={deleteTask}
                                    completeTask={completeTask}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};