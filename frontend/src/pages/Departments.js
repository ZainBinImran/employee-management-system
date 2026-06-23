import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/api';
import Modal from '../components/Modal';
import './Departments.css';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState({ name: '', description: '' });
  const [saving, setSaving]           = useState(false);

  const load = () => {
    getDepartments()
      .then(res => setDepartments(res.data.data))
      .catch(() => setError('Failed to load departments.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openAdd  = () => { setEditing(null); setForm({ name: '', description: '' }); setShowModal(true); };
  const openEdit = (dept) => { setEditing(dept.id); setForm({ name: dept.name, description: dept.description || '' }); setShowModal(true); };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this department? Employees in it will be unassigned.')) return;
    deleteDepartment(id).then(load).catch(() => alert('Delete failed'));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const action = editing ? updateDepartment(editing, form) : createDepartment(form);
    action
      .then(() => { setShowModal(false); load(); })
      .catch(() => alert('Save failed.'))
      .finally(() => setSaving(false));
  };

  if (loading) return <div className="page-status">Loading departments...</div>;
  if (error)   return <div className="page-status error">{error}</div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Departments</h1>
          <p>{departments.length} departments</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Department</button>
      </div>

      <div className="dept-grid">
        {departments.length === 0 ? (
          <div className="empty-state">No departments yet. Add one to get started.</div>
        ) : departments.map(dept => (
          <div key={dept.id} className="dept-card">
            <div className="dept-card-header">
              <span className="dept-icon">🏢</span>
              <div className="dept-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => openEdit(dept)}>Edit</button>
                {' '}
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept.id)}>Delete</button>
              </div>
            </div>
            <h3>{dept.name}</h3>
            <p className="dept-desc">{dept.description || 'No description'}</p>
            <div className="dept-meta">
              <span className="employee-count">👤 {dept.employee_count || 0} employees</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Department' : 'Add Department'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Department Name *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Engineering" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Optional description" />
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

export default Departments;