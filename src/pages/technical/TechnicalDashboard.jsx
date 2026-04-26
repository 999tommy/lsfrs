import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Activity, Users, FileText, Database } from 'lucide-react';

export const TechnicalDashboard = () => {
  const { data } = useData();

  const officers = data.users.filter(u => u.role === 'officer');
  const logsToday = data.logs.filter(l => {
    const today = new Date().toDateString();
    return new Date(l.timestamp).toDateString() === today;
  }).length;

  // Rough storage estimate
  const storageBytes = new Blob([JSON.stringify(data)]).size;
  const storagekb = (storageBytes / 1024).toFixed(1);

  const recentLogs = data.logs.slice(0, 10);

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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, title: 'Total Officers', value: officers.length, color: 'bg-blue-100 text-blue-700' },
          { icon: FileText, title: 'Total Inspections', value: data.inspections.length, color: 'bg-red-100 text-lsfrs-red' },
          { icon: Activity, title: 'Logs Today', value: logsToday, color: 'bg-green-100 text-green-700' },
          { icon: Database, title: 'Storage Used', value: `${storagekb} KB`, color: 'bg-yellow-100 text-yellow-700' },
        ].map(({ icon: Icon, title, value, color }) => (
          <Card key={title} className="hover:shadow-md transition-shadow">
            <CardBody className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${color}`}><Icon className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>Recent Activity</CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left text-gray-600">Time</th>
                <th className="p-3 text-left text-gray-600">Type</th>
                <th className="p-3 text-left text-gray-600">User</th>
                <th className="p-3 text-left text-gray-600">Role</th>
                <th className="p-3 text-left text-gray-600">Description</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-400">No activity yet.</td></tr>
              ) : recentLogs.map(log => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="p-3 text-xs text-gray-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${logTypeColor[log.type] || 'bg-gray-100 text-gray-600'}`}>
                      {log.type?.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-gray-800">{log.userName}</td>
                  <td className="p-3 text-gray-500 capitalize">{log.userRole}</td>
                  <td className="p-3 text-gray-600">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
