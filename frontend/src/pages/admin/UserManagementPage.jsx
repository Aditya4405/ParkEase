import React, { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Modal from '../../components/common/Modal';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  UserCheck, 
  UserX, 
  ShieldCheck,
  Mail,
  Phone,
  Car
} from 'lucide-react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Add User Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    role: 'USER',
    active: true,
  });
  const [newPassword, setNewPassword] = useState('Password@123');
  const [adding, setAdding] = useState(false);

  // Edit User Modal
  const [editingUser, setEditingUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleNumber: '',
    role: 'USER',
    active: true,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await userApi.createUser(newUserData, newPassword);
      setUsers([...users, res.data]);
      setIsAddOpen(false);
      setNewUserData({ name: '', email: '', phone: '', vehicleNumber: '', role: 'USER', active: true });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create user');
    } finally {
      setAdding(false);
    }
  };

  const openEditModal = (u) => {
    setEditingUser(u);
    setEditUserData({
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      vehicleNumber: u.vehicleNumber || '',
      role: u.role,
      active: u.active,
    });
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await userApi.updateUser(editingUser.id, editUserData);
      setUsers(users.map(u => u.id === editingUser.id ? res.data : u));
      setEditingUser(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user');
    } finally {
      setSavingEdit(false);
    }
  };

  const toggleUserActive = async (u) => {
    try {
      const res = await userApi.updateUser(u.id, {
        name: u.name,
        email: u.email,
        phone: u.phone,
        vehicleNumber: u.vehicleNumber,
        role: u.role,
        active: !u.active,
      });
      setUsers(users.map(user => user.id === u.id ? res.data : user));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userName}"?`)) return;
    try {
      await userApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = !searchTerm.trim() ||
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">
            <Users size={32} style={{ color: 'var(--primary)' }} />
            User & Owner Management
          </h1>
          <p className="page-subtitle">Inspect, update roles, toggle activation status, or manage platform accounts.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={17} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.3rem' }}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="ALL">All Roles</option>
              <option value="USER">Drivers (USER)</option>
              <option value="OWNER">Lot Owners (OWNER)</option>
              <option value="ADMIN">Administrators (ADMIN)</option>
            </select>
          </div>

          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Showing {filteredUsers.length} accounts
          </div>
        </div>
      </div>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      {loading ? (
        <LoadingSpinner fullPage text="Loading system users..." />
      ) : filteredUsers.length > 0 ? (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Account ID</th>
                <th>Name & Email</th>
                <th>Phone Number</th>
                <th>Assigned Role</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td><strong>#{u.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{u.name}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-danger' : u.role === 'OWNER' ? 'badge-warning' : 'badge-primary'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleUserActive(u)}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle status"
                    >
                      <span className={`badge ${u.active ? 'badge-success' : 'badge-neutral'}`}>
                        {u.active ? 'Active' : 'Disabled'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={() => openEditModal(u)}
                        className="btn btn-secondary btn-sm"
                        title="Edit account details or role"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="btn btn-danger-outline btn-sm"
                        title="Delete user account"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No users found matching your search.
        </div>
      )}

      {/* Add User Modal */}
      {isAddOpen && (
        <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Create User / Owner Account">
          <form onSubmit={handleCreateUser}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={newUserData.name}
                onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">System Role</label>
                <select
                  className="form-select"
                  value={newUserData.role}
                  onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                >
                  <option value="USER">USER (Driver)</option>
                  <option value="OWNER">OWNER (Facility Operator)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vehicle Plate</label>
                <input
                  type="text"
                  className="form-input"
                  value={newUserData.vehicleNumber}
                  onChange={(e) => setNewUserData({ ...newUserData, vehicleNumber: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setIsAddOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={adding}>
                {adding ? <LoadingSpinner text="Creating..." /> : 'Create Account'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title={`Edit Account: ${editingUser.name}`}>
          <form onSubmit={handleEditUser}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editUserData.name}
                onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={editUserData.email}
                onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={editUserData.role}
                  onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="OWNER">OWNER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={editUserData.phone}
                  onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input
                type="checkbox"
                id="editUserActive"
                checked={editUserData.active}
                onChange={(e) => setEditUserData({ ...editUserData, active: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <label htmlFor="editUserActive" style={{ fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Account Active & Enabled
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setEditingUser(null)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={savingEdit}>
                {savingEdit ? <LoadingSpinner text="Saving..." /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserManagementPage;
