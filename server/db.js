import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'greenfield.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    dept TEXT NOT NULL,
    role TEXT NOT NULL,
    title TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    "join" TEXT,
    salary INTEGER,
    status TEXT,
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    text TEXT NOT NULL
  );
`);

// Initialize sample data if empty
const employeeCount = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;

if (employeeCount === 0) {
  const sampleEmployees = [
    { id: 'GA001', fname: 'Priya', lname: 'Shrestha', dept: 'Sciences', role: 'Teaching', title: 'Head of Sciences', phone: '+977 98XXXXXXXX', email: 'p.shrestha@greenfield.edu.np', join: '2019-08-01', salary: 65000, status: 'active', notes: '' },
    { id: 'GA002', fname: 'Rajan', lname: 'Thapa', dept: 'Mathematics', role: 'Teaching', title: 'Senior Math Teacher', phone: '+977 98XXXXXXXX', email: 'r.thapa@greenfield.edu.np', join: '2020-01-15', salary: 58000, status: 'active', notes: '' },
    { id: 'GA003', fname: 'Sunita', lname: 'Karki', dept: 'Languages', role: 'Teaching', title: 'English Teacher', phone: '+977 98XXXXXXXX', email: 's.karki@greenfield.edu.np', join: '2021-03-01', salary: 52000, status: 'leave', notes: '' },
    { id: 'GA004', fname: 'Bikash', lname: 'Gurung', dept: 'Arts', role: 'Teaching', title: 'Art & Music Teacher', phone: '+977 98XXXXXXXX', email: 'b.gurung@greenfield.edu.np', join: '2018-07-10', salary: 50000, status: 'active', notes: '' },
    { id: 'GA005', fname: 'Anita', lname: 'Rai', dept: 'Administration', role: 'Admin', title: 'Office Manager', phone: '+977 98XXXXXXXX', email: 'a.rai@greenfield.edu.np', join: '2017-05-20', salary: 60000, status: 'active', notes: '' },
    { id: 'GA006', fname: 'Deepak', lname: 'Magar', dept: 'Support', role: 'Support', title: 'IT Technician', phone: '+977 98XXXXXXXX', email: 'd.magar@greenfield.edu.np', join: '2022-09-01', salary: 40000, status: 'active', notes: '' },
    { id: 'GA007', fname: 'Kamala', lname: 'Tamang', dept: 'Mathematics', role: 'Teaching', title: 'Junior Math Teacher', phone: '+977 98XXXXXXXX', email: 'k.tamang@greenfield.edu.np', join: '2023-01-10', salary: 48000, status: 'active', notes: '' },
    { id: 'GA008', fname: 'Roshan', lname: 'Lama', dept: 'Sciences', role: 'Teaching', title: 'Physics Teacher', phone: '+977 98XXXXXXXX', email: 'ro.lama@greenfield.edu.np', join: '2022-04-01', salary: 54000, status: 'leave', notes: '' }
  ];

  const insertEmployee = db.prepare(`
    INSERT INTO employees (id, fname, lname, dept, role, title, phone, email, "join", salary, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((employees) => {
    for (const emp of employees) {
      insertEmployee.run(emp.id, emp.fname, emp.lname, emp.dept, emp.role, emp.title, emp.phone, emp.email, emp.join, emp.salary, emp.status, emp.notes);
    }
  });

  insertMany(sampleEmployees);

  const sampleMessages = [
    { id: 1, type: 'info', text: 'Welcome to the Greenfield staff portal. Use the form to add or update employee profiles.' },
    { id: 2, type: 'warning', text: 'Attendance below 80% for one or more departments.' },
    { id: 3, type: 'success', text: 'Employee data is available from the backend API.' }
  ];

  const insertMessage = db.prepare('INSERT INTO messages (id, type, text) VALUES (?, ?, ?)');
  const insertManyMessages = db.transaction((messages) => {
    for (const msg of messages) {
      insertMessage.run(msg.id, msg.type, msg.text);
    }
  });

  insertManyMessages(sampleMessages);
  console.log('Database initialized with sample data');
}

export default db;
