import React, { useState, useEffect } from 'react';
import { getEmployees, getDepartments, createEmployee, updateEmployee, deleteEmployee } from '../services/api';
import Modal from '../components/Modal';
import './Employees.css';

const emptyForm = { first_name: '', last_name: '', email: '', phone: '', role: '', salary: '', hire_date: '', department_id: '' };

function Employees() {
  const [employees, setEmployees]     = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [saving, setSaving]           = useState(false);

  const load = () => {
    Promise.all([getEmployees(), getDepartments()])
      .then(([empRes, deptRes]) => {
        setEmployees(empRes.data.data);
        setDepartments(deptRes.data.data);
      })
      .catch(() => setError('Failed to load data. Is the backend running?'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (emp) => {
    setEditing(emp.id);
    setForm({
      first_name: emp.first_name, last_name: emp.last_name,
      email: emp.email, phone: emp.phone || '',
      role: emp.role, salary: emp.salary,
      hire_date: emp.hire_date?.split('T')[0] || '',
      department_id: emp.department_id,
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this employee?')) return;
    deleteEmployee(id).then(load).catch(() => alert('Delete failed'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const action = editing ? updateEmployee(editing, form) : createEmployee(form);
    action
      .then(() => { setShowModal(false); load(); })
      .catch(() => alert('Save failed. Check all fields.'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="page-status">Loading employees...</div>;
  if (error)   return <div className="page-status error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Employees</h1>
          <p>{employees.length} total employees</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Employee</button>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Salary</th><th>Hired</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center', color:'#94a3b8', padding:'2rem'}}>No employees yet. Add one!</td></tr>
            ) : employees.map(emp => (
              <tr key={emp.id}>
                <td><strong>{emp.first_name} {emp.last_name}</strong></td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td><span className="badge">{emp.department_name || '—'}</span></td>
                <td>${Number(emp.salary).toLocaleString()}</td>
                <td>{new Date(emp.hire_date).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(emp)}>Edit</button>
                  {' '}
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Employee' : 'Add Employee'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name *</label>
                <input required value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Last Name *</label>
                <input required value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <input required value={form.role} onChange={e => setForm({...form, role: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Salary *</label>
                <input required type="number" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Hire Date *</label>
                <input required type="date" value={form.hire_date} onChange={e => setForm({...form, hire_date: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select required value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})}>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Employees;