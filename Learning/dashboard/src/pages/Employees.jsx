import { useEffect, useState } from "react";

import EmployeeCard from "../components/EmployeeCard";

import "../styles/Employee.css";

function Employees() {

  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {

        setEmployees(data);

        setLoading(false);

      });

  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="employee-container">

      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          name={employee.name}
          email={employee.email}
          company={employee.company.name}
        />
      ))}

    </div>
  );
}

export default Employees;