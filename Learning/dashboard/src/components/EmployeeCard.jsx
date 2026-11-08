function EmployeeCard({ name, email, company }) {
  return (
    <div className="employee-card">

      <h2>{name}</h2>

      <p>{email}</p>

      <h4>{company}</h4>

    </div>
  );
}

export default EmployeeCard;