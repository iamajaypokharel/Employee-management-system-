import { useEffect, useState } from 'react';

const initialForm = {
  id: '',
  fname: '',
  lname: '',
  dept: 'Sciences',
  role: 'Teaching',
  title: '',
  phone: '',
  email: '',
  join: '',
  salary: '',
  status: 'active',
  notes: ''
};

function EmployeeForm({ employee, departments, roles, onSave, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(employee ? { ...employee, salary: employee.salary.toString() } : initialForm);
    setErrors({});
  }, [employee]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm(current => ({ ...current, [name]: value }));
  }

  function validate() {
    const next = {};
    if (!form.fname.trim()) next.fname = 'First name is required.';
    if (!form.lname.trim()) next.lname = 'Last name is required.';
    if (!form.title.trim()) next.title = 'Job title is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Valid email required.';
    if (!form.join.trim()) next.join = 'Join date is required.';
    if (!form.salary.trim() || Number(form.salary) <= 0) next.salary = 'Salary must be a positive number.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSave({
      ...form,
      salary: Number(form.salary),
      id: form.id || undefined
    });
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card" onClick={event => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{employee ? 'Edit Employee' : 'Add Employee'}</h2>
          <button className="icon-btn" onClick={onCancel} aria-label="Close">×</button>
        </div>
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="fields-grid">
            <label>
              First name
              <input name="fname" value={form.fname} onChange={handleChange} />
              {errors.fname && <span className="input-error">{errors.fname}</span>}
            </label>
            <label>
              Last name
              <input name="lname" value={form.lname} onChange={handleChange} />
              {errors.lname && <span className="input-error">{errors.lname}</span>}
            </label>
            <label>
              ID
              <input name="id" value={form.id || 'Will be generated'} disabled />
            </label>
            <label>
              Department
              <select name="dept" value={form.dept} onChange={handleChange}>
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </label>
            <label>
              Role category
              <select name="role" value={form.role} onChange={handleChange}>
                {roles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>
            <label>
              Date of join
              <input type="date" name="join" value={form.join} onChange={handleChange} />
              {errors.join && <span className="input-error">{errors.join}</span>}
            </label>
            <label>
              Job title
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior Teacher" />
              {errors.title && <span className="input-error">{errors.title}</span>}
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. +977 98XXXXXXXX" />
            </label>
            <label>
              Email
              <input name="email" value={form.email} onChange={handleChange} placeholder="name@example.com" />
              {errors.email && <span className="input-error">{errors.email}</span>}
            </label>
            <label>
              Base salary (NPR)
              <input name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="45000" />
              {errors.salary && <span className="input-error">{errors.salary}</span>}
            </label>
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="leave">On Leave</option>
              </select>
            </label>
            <label className="full-width">
              Notes
              <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" placeholder="Optional notes"></textarea>
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary">Save Employee</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeForm;
