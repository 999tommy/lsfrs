import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Users, CheckCircle2, DollarSign, Clock, AlertCircle } from 'lucide-react';

const COLORS = ['#CC0000', '#00843D', '#FFB300', '#1e40af'];

export const AdminDashboard = () => {
  const { data } = useData();

  const inspections = data.inspections;
  const officers = data.users.filter(u => u.role === 'officer');
  const totalRevenue = inspections.reduce((sum, i) => sum + (i.amountPaid || 0), 0);
  const approved = inspections.filter(i => i.status === 'approved').length;
  const pending = inspections.filter(i => i.status === 'awaiting_approval').length;
  const rejected = inspections.filter(i => i.status === 'rejected').length;
  const pendingPayment = inspections.filter(i => i.status === 'pending_payment').length;

  // By station
  const byStation = data.stations.map(st => ({
    name: st.name,
    inspections: inspections.filter(i => i.stationId === st.id).length,
    revenue: inspections.filter(i => i.stationId === st.id).reduce((s, i) => s + (i.amountPaid || 0), 0),
  })).filter(s => s.inspections > 0).sort((a, b) => b.inspections - a.inspections).slice(0, 10);

  const statusData = [
    { name: 'Pending Payment', value: pendingPayment },
    { name: 'Awaiting Approval', value: pending },
    { name: 'Approved', value: approved },
    { name: 'Rejected', value: rejected },
  ].filter(d => d.value > 0);

  const riskData = ['low', 'medium', 'high', 'extreme'].map(r => ({
    name: r.charAt(0).toUpperCase() + r.slice(1),
    value: inspections.filter(i => i.riskClassification === r).length
  })).filter(d => d.value > 0);

  const StatCard = ({ icon: Icon, title, value, sub, color }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={FileText} title="Total Inspections" value={inspections.length} color="bg-red-100 text-lsfrs-red" />
        <StatCard icon={CheckCircle2} title="Approved" value={approved} color="bg-green-100 text-green-700" />
        <StatCard icon={Clock} title="Awaiting Approval" value={pending} color="bg-blue-100 text-blue-700" />
        <StatCard icon={AlertCircle} title="Pending Payment" value={pendingPayment} color="bg-yellow-100 text-yellow-700" />
        <StatCard icon={Users} title="Active Officers" value={officers.filter(u => u.isActive).length} color="bg-purple-100 text-purple-700" />
        <StatCard icon={DollarSign} title="Total Revenue" value={`₦${(totalRevenue / 1000).toFixed(0)}K`} sub={`₦${totalRevenue.toLocaleString()} total`} color="bg-lsfrs-green/10 text-lsfrs-green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inspections by Station */}
        <Card className="lg:col-span-2">
          <CardHeader>Inspections by Station</CardHeader>
          <CardBody>
            {byStation.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byStation} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-40} textAnchor="end" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="inspections" fill="#CC0000" radius={[4,4,0,0]} name="Inspections" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader>Status Breakdown</CardHeader>
          <CardBody>
            {statusData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${value}`}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Station */}
        <Card>
          <CardHeader>Revenue by Station (₦)</CardHeader>
          <CardBody>
            {byStation.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byStation} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" angle={-40} textAnchor="end" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `₦${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={v => `₦${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#00843D" radius={[4,4,0,0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>Risk Distribution</CardHeader>
          <CardBody>
            {riskData.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={riskData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                    {riskData.map((_, i) => <Cell key={i} fill={['#00843D','#FFB300','#f97316','#CC0000'][i % 4]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Stations Table */}
      <Card>
        <CardHeader>All Stations Summary</CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-left text-gray-600">Station</th>
                <th className="p-3 text-left text-gray-600">Code</th>
                <th className="p-3 text-left text-gray-600">Officers</th>
                <th className="p-3 text-left text-gray-600">Inspections</th>
                <th className="p-3 text-left text-gray-600">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.stations.map(st => {
                const stInsp = inspections.filter(i => i.stationId === st.id);
                const stRev = stInsp.reduce((s, i) => s + (i.amountPaid || 0), 0);
                const stOfficers = data.users.filter(u => u.stationId === st.id && u.role === 'officer').length;
                return (
                  <tr key={st.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 font-medium text-gray-800">{st.name}</td>
                    <td className="p-3 text-gray-500 font-mono text-xs">{st.code}</td>
                    <td className="p-3 text-gray-700">{stOfficers}</td>
                    <td className="p-3 text-gray-700">{stInsp.length}</td>
                    <td className="p-3 font-medium text-green-700">{stRev > 0 ? `₦${stRev.toLocaleString()}` : '—'}</td>
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
