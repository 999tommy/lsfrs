import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { LS_KEYS, setStorage } from '../../utils/localStorage';
import { hashPassword } from '../../utils/auth';
import { logActivity } from '../../utils/logger';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export const TechnicalUsers = () => {
  const { data, refreshData } = useData();
  const { currentUser } = useAuth();
  const [editing, setEditing] = useState(null); // { userId, newName, newPassword }

  const users = data.users.filter(u => u.role === 'officer').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const getStation = (id) => data.stations.find(s => s.id === id);

  const startEdit = (user) => {
    setEditing({ userId: user.id, newName: user.name, newPassword: '' });
  };

  const saveEdit = (user) => {
    const updatedUsers = data.users.map(u => {
      if (u.id === editing.userId) {
        const updates = { ...u, name: editing.newName };
        if (editing.newPassword) {
          updates.password = hashPassword(editing.newPassword);
          updates.isFirstLogin = true;
        }
        return updates;
      }
      return u;
    });
    setStorage(LS_KEYS.USERS, updatedUsers);
    logActivity('user_edited', currentUser, `Edited officer: ${user.name}`);
    refreshData();
    setEditing(null);
    toast.success('User updated successfully');
  };

  const toggleActive = (user) => {
    const updatedUsers = data.users.map(u =>
      u.id === user.id ? { ...u, isActive: !u.isActive } : u
    );
    setStorage(LS_KEYS.USERS, updatedUsers);
    logActivity('user_status_changed', currentUser, `${user.isActive ? 'Deactivated' : 'Activated'} officer: ${user.name}`);
    refreshData();
    toast.success(`User ${user.isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">{users.length} officers registered. Edit name, reset password, or toggle active status.</p>
      <div className="space-y-3">
        {users.map(user => {
          const station = getStation(user.stationId);
          const isEditingThis = editing?.userId === user.id;
          return (
            <Card key={user.id}>
              <CardBody>
                {isEditingThis ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                        <input
                          value={editing.newName}
                          onChange={e => setEditing({ ...editing, newName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Reset Password (leave blank to keep)</label>
                        <input
                          type="password"
                          value={editing.newPassword}
                          onChange={e => setEditing({ ...editing, newPassword: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          placeholder="New password..."
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => saveEdit(user)}>Save</Button>
                      <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <h4 className="font-semibold text-gray-800">{user.name}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">@{user.username} · {station?.name || 'Unknown Station'} · Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isActive ? 'green' : 'red'}>{user.isActive ? 'Active' : 'Inactive'}</Badge>
                      <Button variant="outline" className="text-xs py-1 px-2" onClick={() => startEdit(user)}>Edit</Button>
                      <Button
                        variant={user.isActive ? 'danger' : 'secondary'}
                        className="text-xs py-1 px-2"
                        onClick={() => toggleActive(user)}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
