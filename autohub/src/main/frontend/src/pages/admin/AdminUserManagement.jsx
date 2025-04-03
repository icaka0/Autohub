import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole } from '../../services/adminApi';
import './AdminUserManagement.scss';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      
      // Update the local state to reflect the change
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };
  
  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="admin-user-management">
      <h2>User Management</h2>
      
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{`${user.firstName} ${user.lastName || ''}`}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role}</td>
                <td>
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserManagement;