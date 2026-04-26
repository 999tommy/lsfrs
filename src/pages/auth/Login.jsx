import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(username, password);
    if (result.success) {
      const { role, isFirstLogin } = result.user;
      if (role === 'officer' && isFirstLogin) {
        navigate('/officer/settings');
      } else if (role === 'officer') {
        navigate('/officer/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'technical') {
        navigate('/technical/dashboard');
      }
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{ backgroundImage: "url('/background1.jpg')", transform: 'scale(1.05)' }}
      />
      <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px]" />

      <div className="relative z-20 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 border-2 border-lsfrs-red overflow-hidden p-2">
            <img src="/logo.jpg" alt="LSFRS Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            LSFRS Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Fire Safety Inspection System
          </p>
        </div>
      </div>

      <div className="relative z-20 mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-xl shadow-red-900/5">
          <CardBody>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm font-medium">
                  <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <Input
                label="Username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />

              <Input
                label="Password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              <Button type="submit" className="w-full text-lg shadow-md hover:shadow-lg">
                Log In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Are you a new officer?</span>{' '}
              <Link to="/signup" className="font-medium text-lsfrs-red hover:text-red-700">
                Register here
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
