import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { Badge } from '../../components/ui/Badge';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const statusConfig = {
  pending_payment:   { label: 'Pending Payment',   variant: 'yellow' },
  awaiting_approval: { label: 'Awaiting Approval', variant: 'blue'   },
  approved:          { label: 'Approved',           variant: 'green'  },
  rejected:          { label: 'Rejected',           variant: 'red'    },
};

export const AdminInspections = () => {
  const { data } = useData();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = data.inspections
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i => i.facilityName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const getStation = (stationId) => data.stations.find(s => s.id === stationId);
  const getOfficer = (officerId) => data.users.find(u => u.id === officerId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by facility name..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-lsfrs-red"
        />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="awaiting_approval">Awaiting Approval</option>
          <option value="pending_payment">Pending Payment</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Facility</th>
                <th className="p-4 font-semibold text-gray-600">Station</th>
                <th className="p-4 font-semibold text-gray-600">Officer</th>
                <th className="p-4 font-semibold text-gray-600">Amount Paid</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-400">No inspections found.</td></tr>
              ) : filtered.map(insp => {
                const st = statusConfig[insp.status];
                const station = getStation(insp.stationId);
                const officer = getOfficer(insp.officerId);
                return (
                  <tr key={insp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 text-gray-500 whitespace-nowrap">{new Date(insp.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-gray-800">{insp.facilityName}</td>
                    <td className="p-4 text-gray-600">{station?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{officer?.name || 'N/A'}</td>
                    <td className="p-4 text-gray-700 font-medium">
                      {insp.amountPaid ? `₦${insp.amountPaid.toLocaleString()}` : '—'}
                    </td>
                    <td className="p-4">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/admin/inspection/${insp.id}`)}
                        className="text-lsfrs-red hover:underline font-medium"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
