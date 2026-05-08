import { useEffect, useMemo, useState } from 'react';
import EmployeeForm from './components/EmployeeForm.jsx';
import EmployeeList from './components/EmployeeList.jsx';
import Toast from './components/Toast.jsx';

const DEPARTMENTS = ['Sciences', 'Mathematics', 'Languages', 'Arts', 'Administration', 'Support'];
const ROLES = ['Teaching', 'Admin', 'Support'];

function App() {
  const [employees, setEmployees] = useState([]);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [employeeRes, messageRes] = await Promise.all([
        fetch('/api/employees'),
        fetch('/api/messages')
      ]);

      if (!employeeRes.ok || !messageRes.ok) {
        throw new Error('Unable to load portal data.');
      }

      setEmployees(await employeeRes.json());
      setMessages(await messageRes.json());
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      const searchText = `${employee.id} ${employee.fname} ${employee.lname} ${employee.dept} ${employee.role}`.toLowerCase();
      const matchesSearch = searchText.includes(search.toLowerCase());
      const matchesDept = deptFilter ? employee.dept === deptFilter : true;
      const matchesRole = roleFilter ? employee.role === roleFilter : true;
      return matchesSearch && matchesDept && matchesRole;
    });
  }, [employees, search, deptFilter, roleFilter]);

  const stats = useMemo(() => {
    const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);
    const activeCount = employees.filter(emp => emp.status === 'active').length;
    const leaveCount = employees.filter(emp => emp.status === 'leave').length;
    return {
      total: employees.length,
      active: activeCount,
      leave: leaveCount,
      totalPayroll,
      avgSalary: employees.length ? Math.round(totalPayroll / employees.length) : 0
    };
  }, [employees]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4000);
  }

  async function handleSave(employee) {
    try {
      const method = employee.id ? 'PUT' : 'POST';
      const url = employee.id ? `/api/employees/${employee.id}` : '/api/employees';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
      });

      if (!response.ok) {
        throw new Error('Unable to save employee data.');
      }

      const saved = await response.json();
      setEmployees(current => {
        if (employee.id) {
          return current.map(emp => (emp.id === saved.id ? saved : emp));
        }
        return [saved, ...current];
      });
      setShowForm(false);
      setSelectedEmployee(null);
      showToast('Employee information saved successfully.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  async function handleDelete(employeeId) {
    if (!window.confirm('Delete this employee record?')) return;
    try {
      const response = await fetch(`/api/employees/${employeeId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete employee.');
      setEmployees(current => current.filter(emp => emp.id !== employeeId));
      showToast('Employee deleted successfully.');
    } catch (error) {
      showToast(error.message, 'error');
    }
  }

  function openForm(employee = null) {
    setSelectedEmployee(employee);
    setShowForm(true);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Greenfield Academy</p>
          <h1>Staff Portal</h1>
          <p className="subtitle">Fill staff data, retrieve backend messages, and manage employee records with React + Node.</p>
        </div>
        <div className="top-actions">
          <input
            type="search"
            placeholder="Search by name, ID, dept, role"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <button className="btn primary" onClick={() => openForm()}>Add Employee</button>
        </div>
      </header>

      <section className="message-strip">
        {messages.map(msg => (
          <span key={msg.id} className={`message-pill ${msg.type}`}>{msg.text}</span>
        ))}
      </section>

      <section className="panel-grid">
        <article className="metric-card blue">
          <span className="metric-label">Total Staff</span>
          <strong>{stats.total}</strong>
          <span className="metric-note">Active workforce size</span>
        </article>
        <article className="metric-card green">
          <span className="metric-label">Present Today</span>
          <strong>{stats.active}</strong>
          <span className="metric-note">Active employees</span>
        </article>
        <article className="metric-card gold">
          <span className="metric-label">On Leave</span>
          <strong>{stats.leave}</strong>
          <span className="metric-note">Pending leave records</span>
        </article>
        <article className="metric-card grey">
          <span className="metric-label">Total Payroll</span>
          <strong>NPR {stats.totalPayroll.toLocaleString()}</strong>
          <span className="metric-note">Monthly payroll summary</span>
        </article>
      </section>

      <section className="panel search-panel">
        <div className="search-filters">
          <label>
            Department
            <select value={deptFilter} onChange={event => setDeptFilter(event.target.value)}>
              <option value="">All departments</option>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </label>
          <label>
            Role
            <select value={roleFilter} onChange={event => setRoleFilter(event.target.value)}>
              <option value="">All roles</option>
              {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </label>
          <span className="filter-count">Showing {filteredEmployees.length} employees</span>
        </div>
      </section>

      <section className="panel content-panel">
        {loading ? (
          <div className="loading-state">Retrieving employee data...</div>
        ) : (
          <EmployeeList
            employees={filteredEmployees}
            onEdit={openForm}
            onDelete={handleDelete}
          />
        )}
      </section>

      {showForm && (
        <EmployeeForm
          employee={selectedEmployee}
          departments={DEPARTMENTS}
          roles={ROLES}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setSelectedEmployee(null); }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
