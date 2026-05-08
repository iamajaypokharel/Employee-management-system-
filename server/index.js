import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

function createId() {
  const lastEmployee = db.prepare('SELECT id FROM employees ORDER BY id DESC LIMIT 1').get();
  let next = 1;
  if (lastEmployee) {
    const lastNum = parseInt(lastEmployee.id.substring(2));
    next = lastNum + 1;
  }
  return `GA${String(next).padStart(3, '0')}`;
}

app.get('/api/employees', (req, res) => {
  const { search, dept, role } = req.query;
  let query = 'SELECT * FROM employees WHERE 1=1';
  const params = [];

  if (search) {
    const q = `%${search}%`;
    query += ' AND (fname LIKE ? OR lname LIKE ? OR id LIKE ? OR dept LIKE ? OR role LIKE ?)';
    params.push(q, q, q, q, q);
  }

  if (dept) {
    query += ' AND dept = ?';
    params.push(dept);
  }

  if (role) {
    query += ' AND role = ?';
    params.push(role);
  }

  const result = db.prepare(query).all(...params);
  res.json(result);
});

app.post('/api/employees', (req, res) => {
  const data = req.body;
  const id = createId();
  const salary = Number(data.salary) || 0;
  const status = data.status || 'active';

  const insert = db.prepare(`
    INSERT INTO employees (id, fname, lname, dept, role, title, phone, email, "join", salary, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run(id, data.fname, data.lname, data.dept, data.role, data.title, data.phone, data.email, data.join, salary, status, data.notes || '');

  const newEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  res.status(201).json(newEmployee);
});

app.put('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  const updated = {
    ...existing,
    ...req.body,
    salary: Number(req.body.salary) || existing.salary
  };

  const update = db.prepare(`
    UPDATE employees 
    SET fname = ?, lname = ?, dept = ?, role = ?, title = ?, phone = ?, email = ?, "join" = ?, salary = ?, status = ?, notes = ?
    WHERE id = ?
  `);

  update.run(updated.fname, updated.lname, updated.dept, updated.role, updated.title, updated.phone, updated.email, updated.join, updated.salary, updated.status, updated.notes, id);

  const result = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);
  res.json(result);
});

app.delete('/api/employees/:id', (req, res) => {
  const { id } = req.params;
  const existing = db.prepare('SELECT * FROM employees WHERE id = ?').get(id);

  if (!existing) {
    return res.status(404).json({ error: 'Employee not found' });
  }

  db.prepare('DELETE FROM employees WHERE id = ?').run(id);
  res.json(existing);
});

app.get('/api/messages', (req, res) => {
  const messages = db.prepare('SELECT * FROM messages').all();
  res.json(messages);
});

app.get('/api/stats', (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
  const active = db.prepare('SELECT COUNT(*) as count FROM employees WHERE status = ?').get('active').count;
  const leave = db.prepare('SELECT COUNT(*) as count FROM employees WHERE status = ?').get('leave').count;
  const totalPayroll = db.prepare('SELECT SUM(salary) as sum FROM employees').get().sum || 0;

  res.json({ total, active, leave, totalPayroll });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
