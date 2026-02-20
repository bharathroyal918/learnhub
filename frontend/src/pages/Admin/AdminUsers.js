import React, { useState, useEffect } from 'react';
import { getAdminUsers, deleteAdminUser } from '../../utils/api';
import { toast } from 'react-toastify';
import { Delete } from '@mui/icons-material';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchUsers = () => {
    getAdminUsers()
      .then(({ data }) => setUsers(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await deleteAdminUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const filtered = filter === 'all' ? users : users.filter(u => u.type === filter);

  const roleColor = { student: 'success', teacher: 'primary', admin: 'danger' };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <div className="container py-5">
        <h3 className="fw-bold mb-4">Manage Users</h3>

        <div className="d-flex gap-2 mb-4">
          {['all', 'student', 'teacher', 'admin'].map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`btn btn-sm ${filter === t ? 'btn-primary' : 'btn-outline-secondary'} text-capitalize`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(u => (
                    <tr key={u._id}>
                      <td className="fw-semibold">{u.name}</td>
                      <td className="text-muted">{u.email}</td>
                      <td><span className={`badge bg-${roleColor[u.type]}`}>{u.type}</span></td>
                      <td className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(u._id, u.name)}>
                          <Delete fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
