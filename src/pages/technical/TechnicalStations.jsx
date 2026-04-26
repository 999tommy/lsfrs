import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { LS_KEYS, setStorage } from '../../utils/localStorage';
import { logActivity } from '../../utils/logger';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const TechnicalStations = () => {
  const { data, refreshData } = useData();
  const { currentUser } = useAuth();
  const [editing, setEditing] = useState(null);

  const startEdit = (station) => {
    setEditing({ ...station });
  };

  const saveEdit = () => {
    if (!editing.name || !editing.code || !editing.defaultPassword) {
      toast.error('All fields required');
      return;
    }
    const updatedStations = data.stations.map(s =>
      s.id === editing.id ? { ...editing, code: editing.code.toUpperCase() } : s
    );
    setStorage(LS_KEYS.STATIONS, updatedStations);
    logActivity('station_edited', currentUser, `Edited station: ${editing.name}`, { stationId: editing.id });
    refreshData();
    setEditing(null);
    toast.success('Station updated');
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{data.stations.length} stations. You can edit names, codes, and default signup passwords.</p>
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left text-gray-600">ID</th>
              <th className="p-3 text-left text-gray-600">Name</th>
              <th className="p-3 text-left text-gray-600">Code</th>
              <th className="p-3 text-left text-gray-600">Default Password</th>
              <th className="p-3 text-left text-gray-600">Officers</th>
              <th className="p-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.stations.map(station => {
              const officerCount = data.users.filter(u => u.stationId === station.id && u.role === 'officer').length;
              const isEditing = editing?.id === station.id;
              return (
                <tr key={station.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-3 font-mono text-xs text-gray-400">{station.id}</td>
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        value={editing.name}
                        onChange={e => setEditing({ ...editing, name: e.target.value })}
                        className="px-2 py-1 border rounded text-sm w-full"
                      />
                    ) : <span className="font-medium text-gray-800">{station.name}</span>}
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        value={editing.code}
                        onChange={e => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                        className="px-2 py-1 border rounded text-sm w-24 font-mono"
                      />
                    ) : <span className="font-mono text-xs font-bold text-lsfrs-red">{station.code}</span>}
                  </td>
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        value={editing.defaultPassword}
                        onChange={e => setEditing({ ...editing, defaultPassword: e.target.value })}
                        className="px-2 py-1 border rounded text-sm w-36"
                      />
                    ) : <span className="font-mono text-xs text-gray-500">{station.defaultPassword}</span>}
                  </td>
                  <td className="p-3 text-gray-700">{officerCount}</td>
                  <td className="p-3">
                    {isEditing ? (
                      <div className="flex gap-1">
                        <Button className="text-xs py-1 px-2" onClick={saveEdit}>Save</Button>
                        <Button variant="ghost" className="text-xs py-1 px-2" onClick={() => setEditing(null)}>Cancel</Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="text-xs py-1 px-2" onClick={() => startEdit(station)}>Edit</Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
