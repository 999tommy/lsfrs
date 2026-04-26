import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { generateInspectionPDF } from '../../utils/pdf';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileDown, ShieldCheck, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const CHECKLIST_LABELS = [
  "FIRE ALARM SYSTEM","FIRE EXTINGUISHERS","FIRE SPRINKLER SYSTEM (WHERE APPLICABLE)","HOSE REEL","FIRE SAFETY TRAINING",
  "SMOKE DETECTOR","FIRE EMERGENCY EXITS","FIRE SAFETY TRAINING / DRILL RECORD","NOS. OF GENERATORS",
  "AUTOMATIC FIRE ALARM DETECTION SYSTEM","INSURANCE COVER","HOSE BOX","HYDRANT/LANDING VALVE POINT",
  "EMERGENCY LIGHTING","FIRE BLANKET","SAFETY / DIRECTIONAL SIGNS","MUSTER / ASSEMBLY POINT",
  "LAGOS STATE FIRE AND RESCUE SERVICE FIRE NOTICES","FIRE INCIDENT LOG","FIRE SAFETY TRAINING RECORDS FOR STAFF",
  "PREVIOUS FIRE SAFETY COMPLIANCE CERTIFICATE","DESIGNATED FIRE MARSHAL","SOURCE OF WATER SUPPLY FOR FIRE FIGHTING OPERATIONS"
];

const statusConfig = {
  pending_payment:   { label: 'Pending Payment',   variant: 'yellow' },
  approved:          { label: 'Approved (Paid)',    variant: 'green'  },
  rejected:          { label: 'Rejected',           variant: 'red'    },
};

export const InspectionReview = () => {
  const { id } = useParams();
  const { data } = useData();
  const navigate = useNavigate();

  const inspection = data.inspections.find(i => i.id === id);
  const station = data.stations.find(s => s.id === inspection?.stationId);
  const officer = data.users.find(u => u.id === inspection?.officerId);

  if (!inspection) return <div className="p-8 text-center text-gray-500">Inspection not found.</div>;

  const status = statusConfig[inspection.status] || { label: inspection.status, variant: 'gray' };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Eye className="text-gray-400 w-5 h-5" />
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Director View - Monitoring Only</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{inspection.facilityName}</h2>
          <p className="text-gray-500 text-sm mt-1">{inspection.address}</p>
        </div>
        <Badge variant={status.variant} className="text-sm px-3 py-1">{status.label}</Badge>
      </div>

      {/* Key Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          ['Station', station?.name || 'N/A'],
          ['Officer', officer?.name || 'N/A'],
          ['Risk Level', inspection.riskClassification?.toUpperCase()],
          ['CAC Number', inspection.cacNumber || 'N/A'],
        ].map(([label, value]) => (
          <Card key={label}><CardBody className="py-3">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-tight">{label}</p>
            <p className="font-semibold text-gray-800 mt-0.5">{value}</p>
          </CardBody></Card>
        ))}
      </div>

      {/* Financial info */}
      <Card className="bg-gray-50/50 border-dashed">
        <CardBody className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 uppercase">Admin Charge</p>
            <p className="text-lg font-bold">₦{(inspection.adminCharge || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Amount Charged</p>
            <p className="text-lg font-bold text-lsfrs-red">₦{(inspection.amountCharged || 0).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase">Amount Paid (Confirmed)</p>
            <p className="text-lg font-bold text-lsfrs-green">₦{(inspection.amountPaid || 0).toLocaleString()}</p>
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2" onClick={() => generateInspectionPDF(inspection, station, officer?.name)}>
          <FileDown className="w-4 h-4" /> Download Report
        </Button>
        {inspection.status === 'approved' && (
          <Button variant="secondary" className="gap-2" onClick={() => navigate('/admin/certificates')}>
            <ShieldCheck className="w-4 h-4" /> View Certificates
          </Button>
        )}
        <Button variant="ghost" onClick={() => navigate('/admin/inspections')}>← Back</Button>
      </div>

      {/* Checklist review */}
      <Card>
        <CardHeader>Checklist Details</CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 border-b text-left text-gray-600">SN</th>
                <th className="p-3 border-b text-left text-gray-600">Item</th>
                <th className="p-3 border-b text-left text-gray-600">Status</th>
                <th className="p-3 border-b text-left text-gray-600">Remark</th>
              </tr>
            </thead>
            <tbody>
              {CHECKLIST_LABELS.map((label, i) => {
                const item = (inspection.checklistItems || [])[i] || {};
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-400">{i + 1}</td>
                    <td className="p-3 font-medium text-gray-800">{label}</td>
                    <td className="p-3">
                      <Badge variant={
                        item.status === 'Available' || item.status === 'Adequate' ? 'green' :
                        item.status === 'Not Available' || item.status === 'Not Adequate' ? 'red' : 'gray'
                      }>{item.status || '—'}</Badge>
                    </td>
                    <td className="p-3 text-gray-600">{item.remark || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Key Observations & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Observations</CardHeader>
          <CardBody>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {(inspection.keyObservations || []).filter(Boolean).map((obs, i) => <li key={i}>{obs}</li>)}
            </ol>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Recommendations</CardHeader>
          <CardBody>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {(inspection.recommendations || []).filter(Boolean).map((rec, i) => <li key={i}>{rec}</li>)}
            </ol>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>Compliance & Execution</CardHeader>
        <CardBody className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Compliance Status</p>
            <p className="font-semibold mt-1 uppercase">{inspection.fireComplianceStatus?.replace('_', ' ') || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Compliance Timeline</p>
            <p className="font-semibold mt-1 uppercase">{inspection.complianceTimeline || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Inspector</p>
            <p className="font-semibold mt-1">{inspection.inspectorName || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Date Logged</p>
            <p className="font-semibold mt-1">{new Date(inspection.createdAt).toLocaleString()}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
