import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const employees = [
  { id: 'GA001', fname: 'Priya', lname: 'Shrestha', dept: 'Sciences', role: 'Teaching', title: 'Head of Sciences', phone: '+977 98XXXXXXXX', email: 'p.shrestha@greenfield.edu.np', join: '2019-08-01', salary: 65000, status: 'active', notes: '' },
  { id: 'GA002', fname: 'Rajan', lname: 'Thapa', dept: 'Mathematics', role: 'Teaching', title: 'Senior Math Teacher', phone: '+977 98XXXXXXXX', email: 'r.thapa@greenfield.edu.np', join: '2020-01-15', salary: 58000, status: 'active', notes: '' },
  { id: 'GA003', fname: 'Sunita', lname: 'Karki', dept: 'Languages', role: 'Teaching', title: 'English Teacher', phone: '+977 98XXXXXXXX', email: 's.karki@greenfield.edu.np', join: '2021-03-01', salary: 52000, status: 'leave', notes: '' },
  { id: 'GA004', fname: 'Bikash', lname: 'Gurung', dept: 'Arts', role: 'Teaching', title: 'Art & Music Teacher', phone: '+977 98XXXXXXXX', email: 'b.gurung@greenfield.edu.np', join: '2018-07-10', salary: 50000, status: 'active', notes: '' },
  { id: 'GA005', fname: 'Anita', lname: 'Rai', dept: 'Administration', role: 'Admin', title: 'Office Manager', phone: '+977 98XXXXXXXX', email: 'a.rai@greenfield.edu.np', join: '2017-05-20', salary: 60000, status: 'active', notes: '' },
  { id: 'GA006', fname: 'Deepak', lname: 'Magar', dept: 'Support', role: 'Support', title: 'IT Technician', phone: '+977 98XXXXXXXX', email: 'd.magar@greenfield.edu.np', join: '2022-09-01', salary: 40000, status: 'active', notes: '' },
  { id: 'GA007', fname: 'Kamala', lname: 'Tamang', dept: 'Mathematics', role: 'Teaching', title: 'Junior Math Teacher', phone: '+977 98XXXXXXXX', email: 'k.tamang@greenfield.edu.np', join: '2023-01-10', salary: 48000, status: 'active', notes: '' },
  { id: 'GA008', fname: 'Roshan', lname: 'Lama', dept: 'Sciences', role: 'Teaching', title: 'Physics Teacher', phone: '+977 98XXXXXXXX', email: 'ro.lama@greenfield.edu.np', join: '2022-04-01', salary: 54000, status: 'leave', notes: '' }
];

const messages = [
  { id: 1, type: 'info', text: 'Welcome to the Greenfield staff portal. Use the form to add or update employee profiles.' },
  { id: 2, type: 'warning', text: 'Attendance below 80% for one or more departments.' },
  { id: 3, type: 'success', text: 'Employee data is available from the backend API.' }
];

function createId() {
  const next = employees.length + 1;
  return `GA${String(next).padStart(3, '0')}`;
}

app.get('/api/employees', (req, res) => {
  const { search, dept, role } = req.query;
  let result = [...employees];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(emp =>
      `${emp.fname} ${emp.lname}`.toLowerCase().includes(q) ||
      emp.id.toLowerCase().includes(q) ||
      emp.dept.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q)
    );
  }

  if (dept) result = result.filter(emp => emp.dept === dept);
  if (role) result = result.filter(emp => emp.role === role);

  res.json(result);
});

app.post('/api/employees', (req, res) => {
  const data = req.body;
  const newEmployee = {
    ...data,
    id: createId(),
    salary: Number(data.salary) || 0,
    status: data.status || 'active'
  };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return res.status(404).json({ error: 'Employee not found' });

  employees[index] = {
    ...employees[index],
    ...req.body,
    salary: Number(req.body.salary) || employees[index].salary
  };

  res.json(employees[index]);
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return res.status(404).json({ error: 'Employee not found' });

  const removed = employees.splice(index, 1)[0];
  res.json(removed);
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/stats', (req, res) => {
  const total = employees.length;
  const active = employees.filter(emp => emp.status === 'active').length;
  const leave = employees.filter(emp => emp.status === 'leave').length;
  const totalPayroll = employees.reduce((sum, emp) => sum + emp.salary, 0);

  res.json({ total, active, leave, totalPayroll });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
