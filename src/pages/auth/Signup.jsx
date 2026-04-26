import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useData } from '../../contexts/DataContext';
import { LS_KEYS, setStorage } from '../../utils/localStorage';
import { hashPassword } from '../../utils/auth';
import { logActivity } from '../../utils/logger';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardBody } from '../../components/ui/Card';

export const Signup = () => {
  const [stationCode, setStationCode] = useState('');
  const [stationPassword, setStationPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const { data, refreshData } = useData();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. Verify Station Code
    const station = data.stations.find(s => s.code.toUpperCase() === stationCode.toUpperCase());
    if (!station) {
      setError('Invalid Station Code.');
      return;
    }

    // 2. Verify Station Default Password
    if (station.defaultPassword !== stationPassword) {
      setError('Invalid Station Password.');
      return;
    }

    // 3. Verify Username uniqueness
    if (data.users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      setError('Username already exists. Please choose another.');
      return;
    }

    // 4. Create new officer account
    const newUser = {
      id: uuidv4(),
      name: fullName,
      username: username,
      role: 'officer',
      stationId: station.id,
      password: hashPassword(stationPassword), // Initial password is the station password
      isFirstLogin: true, // Will force them to change it on login
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const updatedUsers = [...data.users, newUser];
    setStorage(LS_KEYS.USERS, updatedUsers);

    // Update station officer count
    const updatedStations = data.stations.map(s =>
      s.id === station.id ? { ...s, officerCount: (s.officerCount || 0) + 1 } : s
    );
    setStorage(LS_KEYS.STATIONS, updatedStations);

    logActivity('user_created', newUser, `New officer registered: ${username}`, { stationId: station.id });

    refreshData();
    navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-center py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background with Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/background1.jpg')" }}
      />
      <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px]" />

      <div className="relative z-20 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl mb-4 border-2 border-lsfrs-red overflow-hidden p-2">
            <img src="/logo.jpg" alt="LSFRS Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Officer Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            For use by LSFRS personnel only
          </p>
        </div>
      </div>

      <div className="relative z-20 mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-xl shadow-red-900/5">
          <CardBody>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center text-sm font-medium">
                  <ShieldAlert className="w-5 h-5 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Station Code"
                  type="text"
                  required
                  value={stationCode}
                  onChange={(e) => setStationCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ALAUSA"
                />
                <Input
                  label="Station Password"
                  type="password"
                  required
                  value={stationPassword}
                  onChange={(e) => setStationPassword(e.target.value)}
                  placeholder="Enter station pass"
                />
              </div>

              <hr className="my-2 border-gray-100" />

              <Input
                label="Full Name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. John Doe"
              />

              <Input
                label="Choose Username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. jdoe123"
              />

              <Button type="submit" className="w-full text-lg shadow-md hover:shadow-lg mt-2">
                Register
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">Already have an account?</span>{' '}
              <Link to="/login" className="font-medium text-lsfrs-red hover:text-red-700">
                Log in
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
