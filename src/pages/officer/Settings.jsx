import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LS_KEYS, setStorage } from '../../utils/localStorage';
import { hashPassword, verifyPassword } from '../../utils/auth';
import { logActivity } from '../../utils/logger';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { data, refreshData } = useData();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!verifyPassword(currentPassword, currentUser.password)) {
      toast.error('Current password is incorrect');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Update user in data store
    const updatedUsers = data.users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          password: hashPassword(newPassword),
          isFirstLogin: false
        };
      }
      return u;
    });

    setStorage(LS_KEYS.USERS, updatedUsers);
    
    // Update current session
    const updatedUser = updatedUsers.find(u => u.id === currentUser.id);
    setCurrentUser(updatedUser);
    setStorage(LS_KEYS.CURRENT_USER, updatedUser);

    logActivity('password_changed', updatedUser, 'User changed their password');
    refreshData();
    
    toast.success('Password updated successfully');
    
    // If it was first login, direct to dashboard
    if (currentUser.isFirstLogin) {
      navigate('/officer/dashboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {currentUser?.isFirstLogin && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Action Required</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Since this is your first time logging in, you must change your default station password before continuing.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>Change Password</CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <hr className="my-4" />
            <Input
              label="New Password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm New Password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <div className="pt-4 flex justify-end">
              <Button type="submit">
                Update Password
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
