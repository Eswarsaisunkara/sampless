export const Task = (props) => {
    return (
        <div className="task" style={{ backgroundColor: props.completed ? "#ccf4d8" : "#f3dbdb" }}>
            <h2>{props.id}. {props.taskName}</h2>
            <button
                onClick={() => props.completeTask(props.id)}
                className="btn inc-btn">
                Complete
            </button>
            <button
                onClick={() => props.deleteTask(props.id)}
                className="btn dec-btn">
                Delete
            </button>
        </div>
    )
}