import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LS_KEYS, setStorage } from '../../utils/localStorage';
import { logActivity } from '../../utils/logger';
import { generateInspectionPDF } from '../../utils/pdf';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileDown, CreditCard, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const CHECKLIST_LABELS = [
  "FIRE DETECTION / ALARM SYSTEM",
  "FIRE EXTINGUISHERS",
  "FIRE SUPPRESSION SYSTEM (FM 200, SPRINKLER, CO2, DRENCHERS)",
  "HOSE REEL EQUIPMENT",
  "RISING MAINS (WET)",
  "HYDRANT POINT(S)",
  "HOSE CABINET & COMPONENTS",
  "EMERGENCY LIGHTING",
  "FIRE BLANKET",
  "FIRE SAFETY SIGNAGES",
  "FIRE ASSEMBLY / MUSTER POINT",
  "FIRE NOTICE PLAQUE",
  "DESIGNATED FIRE MARSHAL",
  "FIRE EMERGENCY EXITS",
  "SOURCE OF WATER SUPPLY FOR FIRE FIGHTING OPERATIONS",
  "FIRE SAFETY TRAINING / DRILL RECORD",
  "INSURANCE COVER",
  "FIRE RISK ASSESSMENT",
  "EMERGENCY EVACUATION PLAN",
  "FIRE INCIDENT RECORD",
  "STORAGE OF FLAMMABLE MATERIALS (HOUSEKEEPING)",
  "ELECTRICAL INSTALLATION (HOUSEKEEPING)",
  "INSTALLATION OF GAS CYLINDERS (HOUSEKEEPING)",
  "WASTE STORAGE AND DISPOSAL (HOUSEKEEPING)",
  "GENERATOR(S)"
];

const statusConfig = {
  pending_payment:   { label: 'Pending Payment',   variant: 'yellow' },
  awaiting_approval: { label: 'Awaiting Approval', variant: 'blue'   },
  approved:          { label: 'Approved (Paid)',    variant: 'green'  },
  rejected:          { label: 'Rejected',           variant: 'red'    },
};

const generateCertNumber = (existing) => {
  const year = new Date().getFullYear();
  const count = (existing || []).filter(c => c.certificateNumber?.includes(String(year))).length + 1;
  return `LSFRS/FSC/${year}/${String(count).padStart(5, '0')}`;
};

export const InspectionDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { data, refreshData } = useData();
  const navigate = useNavigate();

  const [amountPaid, setAmountPaid] = useState('');

  const inspection = data.inspections.find(i => i.id === id);
  const station = data.stations.find(s => s.id === inspection?.stationId);

  if (!inspection) {
    return <div className="p-8 text-center text-gray-500">Inspection not found.</div>;
  }

  const status = statusConfig[inspection.status] || { label: inspection.status, variant: 'gray' };

  const handleMarkPaid = () => {
    if (!amountPaid || isNaN(amountPaid) || Number(amountPaid) <= 0) {
      toast.error('Please enter a valid amount paid.');
      return;
    }

    const now = new Date();

    const updatedInspections = data.inspections.map(i => {
      if (i.id === id) {
        return {
          ...i,
          amountPaid: Number(amountPaid),
          paymentDate: now.toISOString(),
          status: 'awaiting_approval',
          updatedAt: now.toISOString()
        };
      }
      return i;
    });

    setStorage(LS_KEYS.INSPECTIONS, updatedInspections);
    logActivity('payment_marked', currentUser, `Payment of ₦${amountPaid} marked for ${inspection.facilityName}. Now awaiting Director approval.`);
    refreshData();
    toast.success('Payment recorded! Sent to Director for final approval.');
    setAmountPaid('');
  };

  const handleDownloadPDF = () => {
    generateInspectionPDF(inspection, station, currentUser.name);
    toast.success('Downloading inspection report...');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{inspection.facilityName}</h2>
          <p className="text-gray-500 text-sm mt-1">{inspection.address}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={status.variant} className="text-sm px-3 py-1">{status.label}</Badge>
        </div>
      </div>

      {/* Awaiting Approval Notice */}
      {inspection.status === 'awaiting_approval' && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md flex gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="text-blue-600 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-700">Awaiting Director Approval</h4>
            <p className="text-sm text-blue-800 mt-1">Payment has been recorded. The Director must now review and approve this inspection before the certificate is issued.</p>
          </div>
        </div>
      )}

      {/* Approval Notice */}
      {inspection.status === 'approved' && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="text-green-600 w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-700">Inspection Approved & Certificate Issued</h4>
            <p className="text-sm text-green-800 mt-1">The Director has approved this inspection. You can now download the certificate.</p>
            <Button 
              variant="secondary" 
              className="mt-3 text-sm shadow-sm"
              onClick={() => navigate('/officer/certificates')}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-3">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Type</p>
            <p className="font-semibold capitalize mt-0.5 truncate">{(inspection.inspectionType || '').replace('_', ' ')}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-3">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Risk</p>
            <p className="font-semibold uppercase mt-0.5">{inspection.riskClassification}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-3">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Admin Fee</p>
            <p className="font-semibold mt-0.5">₦{(inspection.adminCharge || 0).toLocaleString()}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-3">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Charge</p>
            <p className="font-semibold mt-0.5 text-lsfrs-red">₦{(inspection.amountCharged || 0).toLocaleString()}</p>
          </CardBody>
        </Card>
      </div>

      {/* Mark as Paid */}
      {inspection.status === 'pending_payment' && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-lsfrs-green">
              <CreditCard className="w-5 h-5" />
              Finalize Payment & Issue Certificate
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-sm text-gray-600 mb-4">Confirm total amount received from the company to issue the fire safety certificate immediately.</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
              <div className="flex-1 w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount Received (₦)</label>
                <input
                  type="number"
                  min="0"
                  value={amountPaid}
                  onChange={e => setAmountPaid(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-lsfrs-red focus:border-lsfrs-red outline-none"
                  placeholder={`Recommended: ₦${(Number(inspection.adminCharge || 0) + Number(inspection.amountCharged || 0)).toLocaleString()}`}
                />
              </div>
              <Button onClick={handleMarkPaid} className="w-full sm:w-auto bg-lsfrs-green hover:bg-green-700 shadow-md">
                Record Payment & Issue Cert
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleDownloadPDF} className="w-full sm:w-auto flex items-center gap-2 shadow-md">
          <FileDown className="w-4 h-4" />
          Download Inspection Report (PDF)
        </Button>
        <Button variant="ghost" onClick={() => navigate('/officer/dashboard')} className="w-full sm:w-auto">
          ← Back to Dashboard
        </Button>
      </div>

      {/* General Info */}
      <Card>
        <CardHeader>General Information</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ['Date of Inspection', inspection.dateOfInspection],
              ['Time of Arrival', inspection.timeOfArrival],
              ['Team Leader', inspection.teamLeader],
              ['No. of Inspectors', inspection.numberOfInspectors],
              ['Owner/Occupier', inspection.ownerName],
              ['Phone Numbers', Array.isArray(inspection.phoneNumbers) ? inspection.phoneNumbers.join(', ') : inspection.phoneNumbers],
              ['Email', inspection.email],
              ['Tax Payer ID', inspection.taxPayerId],
              ['CAC Number', inspection.cacNumber],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-gray-400 uppercase">{label}</p>
                <p className="font-medium text-gray-800 mt-0.5">{value || '—'}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>Inspection Checklist</CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left border-b font-semibold text-gray-600">SN</th>
                <th className="p-3 text-left border-b font-semibold text-gray-600">Item</th>
                <th className="p-3 text-left border-b font-semibold text-gray-600">Status</th>
                <th className="p-3 text-left border-b font-semibold text-gray-600">Remark</th>
              </tr>
            </thead>
            <tbody>
              {CHECKLIST_LABELS.map((label, i) => {
                const item = (inspection.checklistItems || [])[i] || {};
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-3 text-gray-500">{i + 1}</td>
                    <td className="p-3 text-gray-800 font-medium">{label}</td>
                    <td className="p-3">
                      <Badge variant={
                        item.status === 'Available' || item.status === 'Adequate' ? 'green' :
                        item.status === 'Not Available' || item.status === 'Not Adequate' ? 'red' :
                        'gray'
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
          <CardHeader>Key Observations</CardHeader>
          <CardBody>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {(inspection.keyObservations || []).filter(Boolean).map((obs, i) => (
                <li key={i}>{obs}</li>
              ))}
            </ol>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>Recommendations</CardHeader>
          <CardBody>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              {(inspection.recommendations || []).filter(Boolean).map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>Declaration & Timeline</CardHeader>
        <CardBody className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Compliance</p>
            <p className="font-semibold uppercase truncate">{inspection.fireComplianceStatus?.replace('_', ' ')}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Timeline</p>
            <p className="font-semibold uppercase truncate">{inspection.complianceTimeline}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Inspector</p>
            <p className="font-semibold truncate">{inspection.inspectorName}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Occupier</p>
            <p className="font-semibold truncate">{inspection.occupierName || '—'}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
