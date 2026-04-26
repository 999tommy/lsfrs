import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { generateCertificatePDF } from '../../utils/pdf';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { FileDown, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const Certificates = () => {
  const { currentUser } = useAuth();
  const { data } = useData();

  const myCertificates = data.certificates.filter(c => c.officerId === currentUser.id);

  const handleDownload = (cert) => {
    const inspection = data.inspections.find(i => i.id === cert.inspectionId);
    const station = data.stations.find(s => s.id === cert.stationId);
    generateCertificatePDF(cert, inspection, station);
    toast.success('Downloading certificate...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">My Certificates</h2>
        <p className="text-gray-500 text-sm mt-1">Fire safety certificates issued for your approved inspections.</p>
      </div>

      {myCertificates.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center">
            <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No certificates yet. Certificates appear here once an inspection is approved.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myCertificates.map(cert => {
            const isExpired = new Date(cert.expiresAt) < new Date();
            return (
              <Card key={cert.id} className="hover:shadow-md transition-shadow">
                <CardBody>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="text-lsfrs-green w-5 h-5" />
                        <h3 className="font-bold text-gray-800">{cert.facilityName}</h3>
                      </div>
                      <p className="text-xs text-gray-400 font-mono">{cert.certificateNumber}</p>
                    </div>
                    <Badge variant={isExpired ? 'red' : 'green'}>{isExpired ? 'Expired' : 'Valid'}</Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Issued Date</p>
                      <p className="font-medium">{new Date(cert.issuedAt).toLocaleDateString('en-GB')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Valid Until</p>
                      <p className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-700'}`}>
                        {new Date(cert.expiresAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 text-sm"
                    onClick={() => handleDownload(cert)}
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Download Certificate PDF
                  </Button>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
