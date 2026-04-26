import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AdminUsers = () => {
  const { data } = useData();
  const officers = data.users.filter(u => u.role === 'officer').sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const getStation = (id) => data.stations.find(s => s.id === id);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{officers.length} officer(s) registered across all stations.</p>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-gray-600">Name</th>
              <th className="p-4 text-left text-gray-600">Username</th>
              <th className="p-4 text-left text-gray-600">Station</th>
              <th className="p-4 text-left text-gray-600">Inspections</th>
              <th className="p-4 text-left text-gray-600">Status</th>
              <th className="p-4 text-left text-gray-600">Last Login</th>
            </tr>
          </thead>
          <tbody>
            {officers.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400">No officers registered yet.</td></tr>
            ) : officers.map(user => {
              const station = getStation(user.stationId);
              const inspCount = data.inspections.filter(i => i.officerId === user.id).length;
              return (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-medium text-gray-800">{user.name}</td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{user.username}</td>
                  <td className="p-4 text-gray-700">{station?.name || '—'}</td>
                  <td className="p-4 text-gray-700">{inspCount}</td>
                  <td className="p-4"><Badge variant={user.isActive ? 'green' : 'red'}>{user.isActive ? 'Active' : 'Inactive'}</Badge></td>
                  <td className="p-4 text-gray-400 text-xs">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminStations = () => {
  const { data } = useData();
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{data.stations.length} fire stations. Station codes can be edited in the Technical dashboard.</p>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left text-gray-600">ID</th>
              <th className="p-4 text-left text-gray-600">Station Name</th>
              <th className="p-4 text-left text-gray-600">Code</th>
              <th className="p-4 text-left text-gray-600">Officers</th>
              <th className="p-4 text-left text-gray-600">Inspections</th>
            </tr>
          </thead>
          <tbody>
            {data.stations.map(st => {
              const officers = data.users.filter(u => u.stationId === st.id && u.role === 'officer').length;
              const insp = data.inspections.filter(i => i.stationId === st.id).length;
              return (
                <tr key={st.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-4 font-mono text-xs text-gray-400">{st.id}</td>
                  <td className="p-4 font-medium text-gray-800">{st.name}</td>
                  <td className="p-4 font-mono text-xs font-bold text-lsfrs-red">{st.code}</td>
                  <td className="p-4 text-gray-700">{officers}</td>
                  <td className="p-4 text-gray-700">{insp}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
