import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Card } from '../../components/ui/Card';

const logTypeColor = {
  login: 'bg-blue-100 text-blue-700',
  logout: 'bg-gray-100 text-gray-600',
  inspection_created: 'bg-yellow-100 text-yellow-700',
  payment_marked: 'bg-green-100 text-green-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  certificate_issued: 'bg-purple-100 text-purple-700',
  user_created: 'bg-blue-100 text-blue-700',
  password_changed: 'bg-yellow-100 text-yellow-700',
  station_edited: 'bg-orange-100 text-orange-700',
};

export const TechnicalLogs = () => {
  const { data } = useData();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const allTypes = [...new Set(data.logs.map(l => l.type))];

  const filtered = data.logs.filter(log => {
    const matchSearch = log.description?.toLowerCase().includes(search.toLowerCase()) ||
      log.userName?.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || log.type === typeFilter;
    const matchRole = roleFilter === 'all' || log.userRole === roleFilter;
    return matchSearch && matchType && matchRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search logs..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-lsfrs-red"
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white outline-none">
          <option value="all">All Types</option>
          {allTypes.map(t => <option key={t} value={t}>{t?.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="px-3 py-2 border rounded-lg text-sm bg-white outline-none">
          <option value="all">All Roles</option>
          <option value="officer">Officer</option>
          <option value="admin">Admin</option>
          <option value="technical">Technical</option>
        </select>
      </div>

      <p className="text-sm text-gray-500">{filtered.length} log entries</p>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-gray-600 whitespace-nowrap">Timestamp</th>
              <th className="p-3 text-left text-gray-600">Event Type</th>
              <th className="p-3 text-left text-gray-600">User</th>
              <th className="p-3 text-left text-gray-600">Role</th>
              <th className="p-3 text-left text-gray-600">Station</th>
              <th className="p-3 text-left text-gray-600">Description</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-400">No logs found.</td></tr>
            ) : filtered.map(log => {
              const station = data.stations.find(s => s.id === log.stationId);
              return (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-3 text-xs text-gray-400 whitespace-nowrap font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${logTypeColor[log.type] || 'bg-gray-100 text-gray-600'}`}>
                      {log.type?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-800">{log.userName}</td>
                  <td className="p-3 text-gray-500 capitalize">{log.userRole}</td>
                  <td className="p-3 text-gray-500">{station?.name || '—'}</td>
                  <td className="p-3 text-gray-600">{log.description}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
