import { useState } from "react";

import "../styles/Form.css";

function AddEmployee() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  function handleSubmit(e) {

    e.preventDefault();

    if (name === "" || email === "") {

      setError("All fields are required");

      return;
    }

    if (!email.includes("@")) {

      setError("Invalid Email");

      return;
    }

    setError("");

    alert("Employee Added");

  }

  return (
    <div className="form-container">

      <form onSubmit={handleSubmit}>

        <h1>Add Employee</h1>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">
          Submit
        </button>

        <p>{error}</p>

      </form>

    </div>
  );
}

export default AddEmployee;