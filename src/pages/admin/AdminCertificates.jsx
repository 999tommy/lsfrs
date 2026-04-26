import React from 'react';
import { useData } from '../../contexts/DataContext';
import { generateCertificatePDF } from '../../utils/pdf';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileDown, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminCertificates = () => {
  const { data } = useData();

  const handleDownload = (cert) => {
    const inspection = data.inspections.find(i => i.id === cert.inspectionId);
    const station = data.stations.find(s => s.id === cert.stationId);
    generateCertificatePDF(cert, inspection, station);
    toast.success('Downloading certificate...');
  };

  const getOfficer = (officerId) => data.users.find(u => u.id === officerId);
  const getStation = (stationId) => data.stations.find(s => s.id === stationId);

  return (
    <div className="space-y-6">
      <p className="text-gray-500 text-sm">{data.certificates.length} certificate(s) issued.</p>
      {data.certificates.length === 0 ? (
        <Card><CardBody className="py-12 text-center">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No certificates issued yet.</p>
        </CardBody></Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-sm text-sm border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-gray-600">Cert No.</th>
                <th className="p-4 text-left text-gray-600">Facility</th>
                <th className="p-4 text-left text-gray-600">Station</th>
                <th className="p-4 text-left text-gray-600">Officer</th>
                <th className="p-4 text-left text-gray-600">Issued</th>
                <th className="p-4 text-left text-gray-600">Expires</th>
                <th className="p-4 text-left text-gray-600">Status</th>
                <th className="p-4 text-left text-gray-600">PDF</th>
              </tr>
            </thead>
            <tbody>
              {data.certificates.sort((a,b) => new Date(b.issuedAt) - new Date(a.issuedAt)).map(cert => {
                const isExpired = new Date(cert.expiresAt) < new Date();
                const officer = getOfficer(cert.officerId);
                const station = getStation(cert.stationId);
                return (
                  <tr key={cert.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 font-mono text-xs text-gray-500">{cert.certificateNumber}</td>
                    <td className="p-4 font-medium text-gray-800">{cert.facilityName}</td>
                    <td className="p-4 text-gray-600">{station?.name || '—'}</td>
                    <td className="p-4 text-gray-600">{officer?.name || '—'}</td>
                    <td className="p-4 text-gray-500">{new Date(cert.issuedAt).toLocaleDateString('en-GB')}</td>
                    <td className="p-4 text-gray-500">{new Date(cert.expiresAt).toLocaleDateString('en-GB')}</td>
                    <td className="p-4"><Badge variant={isExpired ? 'red' : 'green'}>{isExpired ? 'Expired' : 'Valid'}</Badge></td>
                    <td className="p-4">
                      <button onClick={() => handleDownload(cert)} className="text-lsfrs-red hover:underline flex items-center gap-1 text-xs font-medium">
                        <FileDown className="w-4 h-4" /> Download
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
