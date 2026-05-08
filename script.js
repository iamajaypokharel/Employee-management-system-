/* ═══════════════════════════════════════════════════════════════ */
/* GREENFIELD ACADEMY — STAFF PORTAL JAVASCRIPT */
/* ═══════════════════════════════════════════════════════════════ */

// ──────── DATA ────────
let employees = [
  {id:'GA001',fname:'Priya',lname:'Shrestha',dept:'Sciences',role:'Teaching',title:'Head of Sciences',phone:'+977 98XXXXXXXX',email:'p.shrestha@greenfield.edu.np',join:'2019-08-01',salary:65000,status:'active',notes:''},
  {id:'GA002',fname:'Rajan',lname:'Thapa',dept:'Mathematics',role:'Teaching',title:'Senior Math Teacher',phone:'+977 98XXXXXXXX',email:'r.thapa@greenfield.edu.np',join:'2020-01-15',salary:58000,status:'active',notes:''},
  {id:'GA003',fname:'Sunita',lname:'Karki',dept:'Languages',role:'Teaching',title:'English Teacher',phone:'+977 98XXXXXXXX',email:'s.karki@greenfield.edu.np',join:'2021-03-01',salary:52000,status:'leave',notes:''},
  {id:'GA004',fname:'Bikash',lname:'Gurung',dept:'Arts',role:'Teaching',title:'Art & Music Teacher',phone:'+977 98XXXXXXXX',email:'b.gurung@greenfield.edu.np',join:'2018-07-10',salary:50000,status:'active',notes:''},
  {id:'GA005',fname:'Anita',lname:'Rai',dept:'Administration',role:'Admin',title:'Office Manager',phone:'+977 98XXXXXXXX',email:'a.rai@greenfield.edu.np',join:'2017-05-20',salary:60000,status:'active',notes:''},
  {id:'GA006',fname:'Deepak',lname:'Magar',dept:'Support',role:'Support',title:'IT Technician',phone:'+977 98XXXXXXXX',email:'d.magar@greenfield.edu.np',join:'2022-09-01',salary:40000,status:'active',notes:''},
  {id:'GA007',fname:'Kamala',lname:'Tamang',dept:'Mathematics',role:'Teaching',title:'Junior Math Teacher',phone:'+977 98XXXXXXXX',email:'k.tamang@greenfield.edu.np',join:'2023-01-10',salary:48000,status:'active',notes:''},
  {id:'GA008',fname:'Roshan',lname:'Lama',dept:'Sciences',role:'Teaching',title:'Physics Teacher',phone:'+977 98XXXXXXXX',email:'ro.lama@greenfield.edu.np',join:'2022-04-01',salary:54000,status:'leave',notes:''},
];

const depts = [
  {name:'Sciences',color:'#2b5fa0',icon:'🔬'},
  {name:'Mathematics',color:'#0f1f3d',icon:'📐'},
  {name:'Languages',color:'#7a5a10',icon:'📚'},
  {name:'Arts',color:'#6b3fa0',icon:'🎨'},
  {name:'Administration',color:'#2d6a4f',icon:'🗂️'},
  {name:'Support',color:'#555',icon:'🔧'},
];

let editingId = null;

// ──────── NAVIGATION ────────
function showPage(name, el) {
  try {
    const pageEl = document.getElementById('page-' + name);
    if (!pageEl) {
      console.error('Page not found:', name);
      return;
    }
    
    // Prevent re-rendering same page
    if (pageEl.classList.contains('active')) return;
    
    // Hide all pages & deactivate nav
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    // Show new page & activate nav
    pageEl.classList.add('active');
    if (el) el.classList.add('active');
    
    // Update title
    document.getElementById('page-title').textContent = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Render page-specific content
    if (name === 'employees') renderEmployeeCards();
    if (name === 'attendance') renderAttendance();
    if (name === 'departments') renderDepartments();
    if (name === 'payroll') renderPayroll();
    if (name === 'reports') renderReports();
  } catch (e) {
    console.error('Navigation error:', e);
    showToast('❌ Error loading page');
  }
}

// ──────── DASHBOARD ────────
function renderDashboard() {
  try {
    const active = employees.filter(e => e.status === 'active').length;
    const leave = employees.filter(e => e.status === 'leave').length;
    const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
    const avgSalary = employees.length ? Math.round(totalSalary / employees.length) : 0;
    
    document.getElementById('stat-total').textContent = employees.length;
    document.getElementById('stat-present').textContent = active;
    document.getElementById('stat-leave').textContent = leave;

    // Notices
    const notices = document.getElementById('dashboard-notices');
    if (notices) {
      const noticesList = [];
      if (leave > 2) noticesList.push({type:'warning', msg:`⚠️ ${leave} employees on leave - Consider coverage planning`});
      if (active < employees.length * 0.8) noticesList.push({type:'alert', msg:`🔔 Attendance below 80% - Monitor closely`});
      if (employees.filter(e => e.salary > 60000).length > 3) noticesList.push({type:'info', msg:`📊 Multiple high-salary positions - Budget impact`});
      noticesList.push({type:'success', msg:`✅ System running smoothly - All departments active`});
      
      notices.innerHTML = noticesList.map(n => {
        const classList = n.type === 'alert' ? 'notice-alert' : n.type === 'warning' ? 'notice-warning' : n.type === 'success' ? 'notice-success' : 'notice-info';
        return `<div class="notice-box ${classList}">${n.msg}</div>`;
      }).join('');
    }

    // Table
    const tbody = document.getElementById('dashboard-table-body');
    if (tbody) {
      tbody.innerHTML = employees.slice(0, 6).map(e => `
        <tr>
          <td><div class="emp-name-cell">
            <div class="emp-avatar-sm">${e.fname[0]}${e.lname[0]}</div>
            <div><strong>${e.fname} ${e.lname}</strong><br><span style="font-size:.76rem;color:var(--slate);">${e.id}</span></div>
          </div></td>
          <td>${e.dept}</td>
          <td><span class="badge badge-${e.role.toLowerCase()}">${e.role}</span></td>
          <td><span class="badge badge-${e.status}">${e.status === 'active' ? 'Active' : 'On Leave'}</span></td>
          <td><div class="action-btns">
            <button class="btn btn-outline btn-sm" onclick="openModal('edit','${e.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteEmployee('${e.id}')">Del</button>
          </div></td>
        </tr>`).join('');
    }

    // Stats
    const statAvgEl = document.getElementById('stat-avg-salary');
    if (statAvgEl) statAvgEl.textContent = 'NPR ' + avgSalary.toLocaleString();
    
    const statTotalPayEl = document.getElementById('stat-total-payroll');
    if (statTotalPayEl) statTotalPayEl.textContent = 'NPR ' + totalSalary.toLocaleString();

    // Dept bars
    renderDeptBars();
  } catch (e) {
    console.error('Dashboard render error:', e);
  }
}

function renderDeptBars() {
  try {
    const container = document.getElementById('dept-bars');
    const legend = document.getElementById('dept-legend');
    if (!container || !legend) return;
    
    const counts = {};
    depts.forEach(d => counts[d.name] = employees.filter(e => e.dept === d.name).length);
    const max = Math.max(...Object.values(counts), 1);
    
    container.innerHTML = depts.map(d => `
      <div class="bar-wrap">
        <div class="bar" style="height:${(counts[d.name] / max) * 90}px;background:${d.color};"></div>
        <div class="bar-label">${d.name.substring(0, 4)}</div>
      </div>`).join('');
    
    legend.innerHTML = depts.map(d => `
      <span style="display:flex;align-items:center;gap:4px;font-size:.72rem;color:var(--slate);">
        <span style="width:8px;height:8px;border-radius:50%;background:${d.color};display:inline-block;"></span>
        ${d.name}: ${counts[d.name]}
      </span>`).join('');
  } catch (e) {
    console.error('Department bars render error:', e);
  }
}

function searchEmployees(q) {
  q = q.toLowerCase();
  const rows = document.querySelectorAll('#dashboard-table-body tr');
  rows.forEach(r => r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none');
}

// ──────── EMPLOYEES ────────
function renderEmployeeCards() {
  try {
    const deptFilter = document.getElementById('dept-filter').value;
    const roleFilter = document.getElementById('role-filter').value;
    const filtered = employees.filter(e =>
      (!deptFilter || e.dept === deptFilter) &&
      (!roleFilter || e.role === roleFilter)
    );
    const grid = document.getElementById('employees-grid');
    if (grid) {
      grid.innerHTML = filtered.map(e => `
        <div class="emp-card" onclick="openModal('edit','${e.id}')">
          <div class="emp-card-top ${e.role === 'Admin' ? 'gold' : e.role === 'Support' ? 'green' : ''}">
            <div class="emp-card-avatar">${e.fname[0]}${e.lname[0]}</div>
          </div>
          <div class="emp-card-body">
            <div class="emp-card-name">${e.fname} ${e.lname}</div>
            <div class="emp-card-role">${e.title || e.role}</div>
            <div class="emp-card-meta">
              <span class="badge badge-${e.role.toLowerCase()}">${e.role}</span>
              <span class="badge badge-${e.status}">${e.status}</span>
            </div>
          </div>
          <div class="emp-card-footer">
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); openModal('edit','${e.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteEmployee('${e.id}')">Delete</button>
          </div>
        </div>
      `).join('');
    }
  } catch (e) {
    console.error('Employee cards render error:', e);
  }
}

// ──────── ATTENDANCE ────────
function renderAttendance() {
  try {
    // Calendar strip
    const strip = document.getElementById('calendar-strip');
    if (strip) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const now = new Date();
      strip.innerHTML = Array.from({length: 7}, (_, i) => {
        const d = new Date(now);
        d.setDate(now.getDate() - 3 + i);
        return `<div class="cal-day ${i === 3 ? 'active' : ''}" onclick="selectDay(this, ${i})">
          <div class="day-name">${days[d.getDay()]}</div>
          <div class="day-num">${d.getDate()}</div>
        </div>`;
      }).join('');
    }

    // Attendance table
    const statuses = ['active', 'active', 'leave', 'active', 'active', 'active', 'active', 'active'];
    const times = ['08:02', '08:15', '—', '07:58', '08:22', '08:05', '08:30', '—'];
    const tbody = document.getElementById('att-table');
    if (tbody) {
      tbody.innerHTML = employees.map((e, i) => {
        const s = statuses[i % 8];
        const t = times[i % 8];
        const col = s === 'active' ? 'var(--green)' : s === 'leave' ? 'var(--gold)' : 'var(--red)';
        const label = s === 'active' ? 'Present' : s === 'leave' ? 'On Leave' : 'Absent';
        return `<tr>
          <td><div class="emp-name-cell">
            <div class="emp-avatar-sm">${e.fname[0]}${e.lname[0]}</div>
            ${e.fname} ${e.lname}
          </div></td>
          <td>${e.dept}</td>
          <td>${t}</td>
          <td><span style="color:${col};font-weight:500;font-size:.83rem;">● ${label}</span></td>
          <td>
            <select style="padding:4px 8px;border-radius:6px;border:1px solid #ddd;font-size:.8rem;" onchange="showToast('✅ Attendance updated!')">
              <option ${s === 'active' ? 'selected' : ''}>Present</option>
              <option ${s === 'leave' ? 'selected' : ''}>On Leave</option>
              <option ${s === 'absent' ? 'selected' : ''}>Absent</option>
            </select>
          </td>
        </tr>`;
      }).join('');
    }

    // Summary
    const sl = document.getElementById('att-summary-list');
    if (sl) {
      sl.innerHTML = depts.map(d => {
        const total = employees.filter(e => e.dept === d.name).length;
        const pres = employees.filter(e => e.dept === d.name && e.status === 'active').length;
        const pct = total ? Math.round(pres / total * 100) : 0;
        return `<div>
          <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:3px;">
            <span>${d.icon} ${d.name}</span><span>${pres}/${total}</span>
          </div>
          <div style="height:6px;background:#eee;border-radius:4px;">
            <div style="height:100%;width:${pct}%;background:${d.color};border-radius:4px;transition:width .5s;"></div>
          </div>
        </div>`;
      }).join('');
    }
  } catch (e) {
    console.error('Attendance render error:', e);
  }
}

function selectDay(el, i) {
  document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
}

// ──────── DEPARTMENTS ────────
function renderDepartments() {
  try {
    const container = document.getElementById('dept-cards');
    if (container) {
      container.innerHTML = depts.map(d => {
        const staff = employees.filter(e => e.dept === d.name);
        const head = staff.find(e => e.role === 'Teaching');
        const totalSalary = staff.reduce((s, e) => s + e.salary, 0);
        return `<div class="card" onclick="filterDept('${d.name}')" style="cursor:pointer;">
          <div style="height:6px;background:${d.color};"></div>
          <div class="card-body">
            <div style="font-size:2rem;margin-bottom:8px;">${d.icon}</div>
            <div style="font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:var(--navy);">${d.name}</div>
            <div style="font-size:.8rem;color:var(--slate);margin-top:4px;">Head: ${head ? head.fname + ' ' + head.lname : '—'}</div>
            <div style="margin-top:14px;display:flex;gap:12px;">
              <div style="text-align:center;">
                <div style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:${d.color};">${staff.length}</div>
                <div style="font-size:.72rem;color:var(--slate);">Staff</div>
              </div>
              <div style="text-align:center;">
                <div style="font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:var(--green);">${staff.filter(e => e.status === 'active').length}</div>
                <div style="font-size:.72rem;color:var(--slate);">Active</div>
              </div>
              <div style="text-align:center;">
                <div style="font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:#8a6a1a;">NPR ${(totalSalary / 100000).toFixed(1)}L</div>
                <div style="font-size:.72rem;color:var(--slate);">Budget</div>
              </div>
            </div>
            <div style="margin-top:14px;display:flex;flex-wrap:wrap;gap:6px;">
              ${staff.map(e => `<span style="font-size:.72rem;background:#f0f0f0;padding:3px 8px;border-radius:20px;">${e.fname}</span>`).join('')}
            </div>
          </div>
        </div>`;
      }).join('');
    }
  } catch (e) {
    console.error('Departments render error:', e);
  }
}

function filterDept(name) {
  const navEl = document.querySelector('.nav-item[onclick*="employees"]');
  showPage('employees', navEl);
  document.getElementById('dept-filter').value = name;
  renderEmployeeCards();
}

// ──────── PAYROLL ────────
function renderPayroll() {
  try {
    const tbody = document.getElementById('payroll-table');
    if (tbody) {
      tbody.innerHTML = employees.map(e => {
        const allow = Math.round(e.salary * 0.15);
        const deduct = Math.round(e.salary * 0.10);
        const net = e.salary + allow - deduct;
        const paid = Math.random() > 0.3;
        return `<tr>
          <td><div class="emp-name-cell">
            <div class="emp-avatar-sm">${e.fname[0]}${e.lname[0]}</div>
            ${e.fname} ${e.lname}
          </div></td>
          <td>${e.dept}</td>
          <td>NPR ${e.salary.toLocaleString()}</td>
          <td>NPR ${allow.toLocaleString()}</td>
          <td>NPR ${deduct.toLocaleString()}</td>
          <td><strong>NPR ${net.toLocaleString()}</strong></td>
          <td><span class="badge ${paid ? 'badge-active' : 'badge-leave'}">${paid ? 'Paid' : 'Pending'}</span></td>
        </tr>`;
      }).join('');
    }
  } catch (e) {
    console.error('Payroll render error:', e);
  }
}

// ──────── REPORTS ────────
function renderReports() {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const attData = [91, 88, 85, 90, 87, 0];
    const c1 = document.getElementById('monthly-att-chart');
    if (c1) {
      c1.innerHTML = months.map((m, i) => `
        <div class="bar-wrap">
          <div class="bar blue" style="height:${attData[i]}px;"></div>
          <div class="bar-label">${m}</div>
        </div>`).join('');
    }

    const cats = [{l:'Teaching',v:70,c:'var(--navy)'},{l:'Admin',v:17,c:'var(--green)'},{l:'Support',v:13,c:'var(--gold)'}];
    const c2 = document.getElementById('category-chart');
    if (c2) {
      c2.innerHTML = cats.map(c => `
        <div>
          <div style="display:flex;justify-content:space-between;font-size:.82rem;margin-bottom:4px;"><span>${c.l}</span><span>${c.v}%</span></div>
          <div style="height:8px;background:#eee;border-radius:4px;">
            <div style="height:100%;width:${c.v}%;background:${c.c};border-radius:4px;"></div>
          </div>
        </div>`).join('');
    }

    const salaries = depts.map(d => employees.filter(e => e.dept === d.name).reduce((s, e) => s + e.salary, 0) / 1000);
    const max = Math.max(...salaries, 1);
    const c3 = document.getElementById('payroll-chart');
    if (c3) {
      c3.innerHTML = depts.map((d, i) => `
        <div class="bar-wrap">
          <div class="bar green" style="height:${(salaries[i] / max) * 100}px;background:${d.color};"></div>
          <div class="bar-label">${d.name.substring(0, 3)}</div>
        </div>`).join('');
    }
  } catch (e) {
    console.error('Reports render error:', e);
  }
}

// ──────── MODAL ────────
function openModal(mode, id) {
  editingId = null;
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.classList.add('open');
  
  if (mode === 'add') {
    document.getElementById('modal-title').textContent = 'Add New Employee';
    clearForm();
    document.getElementById('f-id').value = 'GA' + String(employees.length + 1).padStart(3, '0');
    document.getElementById('f-join').value = new Date().toISOString().split('T')[0];
  } else {
    const emp = employees.find(x => x.id === id);
    if (!emp) return;
    editingId = id;
    document.getElementById('modal-title').textContent = 'Edit Employee';
    document.getElementById('f-id').value = emp.id;
    document.getElementById('f-fname').value = emp.fname;
    document.getElementById('f-lname').value = emp.lname;
    document.getElementById('f-dept').value = emp.dept;
    document.getElementById('f-role').value = emp.role;
    document.getElementById('f-title').value = emp.title || '';
    document.getElementById('f-phone').value = emp.phone || '';
    document.getElementById('f-email').value = emp.email || '';
    document.getElementById('f-join').value = emp.join || '';
    document.getElementById('f-salary').value = emp.salary || '';
    document.getElementById('f-notes').value = emp.notes || '';
  }
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal-overlay')) {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('open');
  }
}

function clearForm() {
  ['f-fname', 'f-lname', 'f-phone', 'f-email', 'f-title', 'f-notes'].forEach(id => document.getElementById(id).value = '');
  ['f-dept', 'f-role'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-salary').value = '';
}

function saveEmployee() {
  const fname = document.getElementById('f-fname').value.trim();
  const lname = document.getElementById('f-lname').value.trim();
  const dept = document.getElementById('f-dept').value;
  const role = document.getElementById('f-role').value;
  
  if (!fname || !lname || !dept || !role) {
    showToast('❌ Please fill required fields!');
    return;
  }
  
  const emp = {
    id: document.getElementById('f-id').value,
    fname, lname, dept, role,
    title: document.getElementById('f-title').value,
    phone: document.getElementById('f-phone').value,
    email: document.getElementById('f-email').value,
    join: document.getElementById('f-join').value,
    salary: parseInt(document.getElementById('f-salary').value) || 0,
    status: 'active',
    notes: document.getElementById('f-notes').value,
  };
  
  if (editingId) {
    const idx = employees.findIndex(e => e.id === editingId);
    employees[idx] = {...employees[idx], ...emp};
    showToast('✏️ Employee updated!');
  } else {
    employees.push(emp);
    showToast('➕ Employee added successfully!');
  }
  closeModal();
  renderDashboard();
}

function deleteEmployee(id) {
  if (!confirm('❌ Remove this employee?')) return;
  employees = employees.filter(e => e.id !== id);
  renderDashboard();
  renderEmployeeCards();
  showToast('🗑️ Employee removed.');
}

// ──────── TOAST ────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ──────── INIT ────────
document.addEventListener('DOMContentLoaded', function() {
  renderDashboard();
});