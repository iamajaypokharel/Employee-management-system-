function EmployeeList({ employees, onEdit, onDelete }) {
  return (
    <div className="employee-table-wrap">
      {employees.length === 0 ? (
        <div className="empty-state">No employee records match your search.</div>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Role</th>
              <th>Status</th>
              <th>Salary</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee.id}>
                <td>
                  <div className="employee-name-cell">
                    <div className="avatar">{employee.fname.charAt(0)}{employee.lname.charAt(0)}</div>
                    <div>
                      <strong>{employee.fname} {employee.lname}</strong>
                      <div className="subtext">{employee.title}</div>
                    </div>
                  </div>
                </td>
                <td>{employee.dept}</td>
                <td>{employee.role}</td>
                <td><span className={`status-chip ${employee.status}`}>{employee.status}</span></td>
                <td>NPR {employee.salary.toLocaleString()}</td>
                <td className="action-buttons">
                  <button className="btn ghost small" onClick={() => onEdit(employee)}>Edit</button>
                  <button className="btn danger small" onClick={() => onDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmployeeList;
