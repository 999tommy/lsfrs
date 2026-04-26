import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { ClipboardList, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

export const Dashboard = () => {
  const { currentUser } = useAuth();
  const { data } = useData();
  const navigate = useNavigate();

  // Filter inspections for this officer
  const myInspections = data.inspections.filter(i => i.officerId === currentUser.id);
  
  const pendingPayment = myInspections.filter(i => i.status === 'pending_payment').length;
  const awaitingApproval = myInspections.filter(i => i.status === 'awaiting_approval').length;
  const rejected = myInspections.filter(i => i.status === 'rejected').length;
  const approved = myInspections.filter(i => i.status === 'approved').length;

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardBody className="flex items-center">
        <div className={`p-3 rounded-full mr-4 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
      </CardBody>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome, {currentUser.name}</h2>
          <p className="text-gray-500">Here's your inspection overview.</p>
        </div>
        <button 
          onClick={() => navigate('/officer/inspection/new')}
          className="flex items-center px-4 py-2 bg-lsfrs-red text-white rounded-lg hover:bg-red-800 transition-colors"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          New Inspection
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Payment" value={pendingPayment} icon={ClipboardList} colorClass="bg-yellow-100 text-yellow-600" />
        <StatCard title="Awaiting Approv." value={awaitingApproval} icon={AlertCircle} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Rejected" value={rejected} icon={AlertCircle} colorClass="bg-red-100 text-red-600" />
        <StatCard title="Approved" value={approved} icon={CheckCircle2} colorClass="bg-green-100 text-green-600" />
      </div>

      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Recent Inspections</h3>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Facility Name</th>
                <th className="p-4 font-semibold text-gray-600">Risk</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {myInspections.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No inspections found. Click "New Inspection" to start.
                  </td>
                </tr>
              ) : (
                myInspections.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10).map(insp => (
                  <tr key={insp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 text-gray-600">{new Date(insp.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-gray-800">{insp.facilityName}</td>
                    <td className="p-4">
                      <Badge variant={insp.riskClassification === 'extreme' || insp.riskClassification === 'high' ? 'red' : 'yellow'}>
                        {insp.riskClassification.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant={
                        insp.status === 'approved' ? 'green' : 
                        insp.status === 'rejected' ? 'red' : 
                        insp.status === 'awaiting_approval' ? 'blue' : 'yellow'
                      }>
                        {insp.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => navigate(`/officer/inspection/${insp.id}`)}
                        className="text-lsfrs-red hover:underline font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
