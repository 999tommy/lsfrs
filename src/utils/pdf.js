import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CHECKLIST_LABELS = [
  "FIRE ALARM SYSTEM", "FIRE EXTINGUISHERS", "FIRE SPRINKLER SYSTEM (WHERE APPLICABLE)",
  "HOSE REEL", "FIRE SAFETY TRAINING", "SMOKE DETECTOR", "FIRE EMERGENCY EXITS",
  "FIRE SAFETY TRAINING / DRILL RECORD", "NOS. OF GENERATORS", "AUTOMATIC FIRE ALARM DETECTION SYSTEM",
  "INSURANCE COVER", "HOSE BOX", "HYDRANT/LANDING VALVE POINT", "EMERGENCY LIGHTING",
  "FIRE BLANKET", "SAFETY / DIRECTIONAL SIGNS", "MUSTER / ASSEMBLY POINT",
  "LAGOS STATE FIRE AND RESCUE SERVICE FIRE NOTICES", "FIRE INCIDENT LOG",
  "FIRE SAFETY TRAINING RECORDS FOR STAFF", "PREVIOUS FIRE SAFETY COMPLIANCE CERTIFICATE",
  "DESIGNATED FIRE MARSHAL", "SOURCE OF WATER SUPPLY FOR FIRE FIGHTING OPERATIONS"
];

const addPageHeader = (doc, pageWidth) => {
  // Red header bar
  doc.setFillColor(204, 0, 0);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('LAGOS STATE FIRE AND RESCUE SERVICE', pageWidth / 2, 10, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('FIRE PREVENTION DEPARTMENT', pageWidth / 2, 17, { align: 'center' });
  doc.text('FIRE SAFETY INSPECTION CHECK LIST', pageWidth / 2, 23, { align: 'center' });
  doc.setTextColor(0, 0, 0);
};

export const generateInspectionPDF = (inspection, station, officerName) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  addPageHeader(doc, pageWidth);

  let y = 35;

  // Section A Header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('SECTION A – GENERAL INFORMATION', margin + 2, y);
  y += 8;

  const lineH = 7;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Name of Facility:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.facilityName || '', margin + 30, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Address:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.address || '', margin + 18, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Type of Occupancy:', margin, y);
  doc.setFont('helvetica', 'normal');
  const occ = inspection.occupancyType === 'others'
    ? `Others: ${inspection.occupancyTypeOther || ''}`
    : (inspection.occupancyType || '').charAt(0).toUpperCase() + (inspection.occupancyType || '').slice(1);
  doc.text(occ, margin + 38, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Owner/Occupier Name:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.ownerName || '', margin + 42, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Phone Number(s):', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(Array.isArray(inspection.phoneNumbers) ? inspection.phoneNumbers.join(', ') : (inspection.phoneNumbers || ''), margin + 34, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.email || 'N/A', margin + 14, y);
  doc.setFont('helvetica', 'bold');
  doc.text("Tax Payer's ID:", pageWidth / 2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.taxPayerId || 'N/A', pageWidth / 2 + 30, y);
  y += lineH;
  
  doc.setFont('helvetica', 'bold');
  doc.text("CAC Number:", margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.cacNumber || 'N/A', margin + 25, y);
  y += lineH + 2;

  // Inspection Details
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('INSPECTION DETAILS', margin + 2, y);
  y += 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Inspection:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.dateOfInspection || 'N/A', margin + 35, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Time of Arrival:', pageWidth / 2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.timeOfArrival || 'N/A', pageWidth / 2 + 30, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Inspection Type:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text((inspection.inspectionType || '').replace('_', ' ').toUpperCase(), margin + 30, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Team Leader:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.teamLeader || 'N/A', margin + 25, y);
  doc.setFont('helvetica', 'bold');
  doc.text('No. of Inspectors:', pageWidth / 2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(String(inspection.numberOfInspectors || 'N/A'), pageWidth / 2 + 36, y);
  y += lineH;

  doc.setFont('helvetica', 'bold');
  doc.text('Fire Station:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(station?.name || 'N/A', margin + 24, y);
  y += lineH + 4;

  // Checklist Table
  autoTable(doc, {
    startY: y,
    head: [['SN', 'Item', 'Status', 'Remark']],
    body: CHECKLIST_LABELS.map((label, i) => {
      const item = (inspection.checklistItems || [])[i] || {};
      return [i + 1, label, item.status || '', item.remark || ''];
    }),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [204, 0, 0], textColor: [255, 255, 255], fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 90 },
      2: { cellWidth: 35 },
      3: { cellWidth: 45 },
    },
    didDrawPage: (data) => { addPageHeader(doc, pageWidth); }
  });

  y = doc.lastAutoTable.finalY + 6;

  // Housekeeping
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('24. GOOD HOUSEKEEPING', margin + 2, y);
  y += 8;

  const housekeeping = inspection.housekeeping || {};
  const hkItems = [
    ['i. Proper Storage of Flammable Material', housekeeping.flammable],
    ['ii. Electrical Installation Properly Maintained', housekeeping.electrical],
    ['iii. Gas Cylinders Properly Stored and Secured', housekeeping.gas],
    ['iv. No Combustible Waste Accumulation', housekeeping.waste],
  ];
  hkItems.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(label + ':', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value || 'N/A', margin + 80, y);
    y += 6;
  });
  y += 4;

  // Observations & Recommendations
  const wrapSection = (title, items) => {
    if (y > 240) { doc.addPage(); addPageHeader(doc, pageWidth); y = 35; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
    doc.text(title, margin + 2, y);
    y += 8;
    (items || []).forEach((item, i) => {
      if (item && i < 5) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text(`${i + 1}.`, margin, y);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(item, pageWidth - margin * 2 - 8);
        lines.forEach(line => { doc.text(line, margin + 6, y); y += 5; });
      }
    });
    y += 3;
  };

  wrapSection('KEY OBSERVATIONS', inspection.keyObservations);
  wrapSection('RECOMMENDATIONS & COMPLIANCE', inspection.recommendations);
  
  // Financial Charges
  if (y > 250) { doc.addPage(); addPageHeader(doc, pageWidth); y = 35; }
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('FINANCIAL CHARGES & COMPLIANCE', margin + 2, y);
  y += 8;
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Administrative Charge:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`N${(inspection.adminCharge || 0).toLocaleString()}`, margin + 40, y);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Amount Charged:', pageWidth / 2, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`N${(inspection.amountCharged || 0).toLocaleString()}`, pageWidth / 2 + 30, y);
  y += lineH;

  // Compliance
  doc.setFont('helvetica', 'bold');
  doc.text('Fire Safety Certificate Compliance:', margin, y);
  doc.setFont('helvetica', 'normal');
  const compliance = inspection.fireComplianceStatus === 'complied' ? 'COMPLIED' : 'NON-COMPLIED';
  doc.text(compliance, margin + 55, y);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Classification:', pageWidth / 2, y);
  doc.setFont('helvetica', 'normal');
  doc.text((inspection.riskClassification || 'N/A').toUpperCase(), pageWidth / 2 + 35, y);
  y += lineH;

  // Timeline
  doc.setFont('helvetica', 'bold');
  doc.text('Compliance Timeline:', margin, y);
  doc.setFont('helvetica', 'normal');
  const timeline = { immediate: 'IMMEDIATE', '7days': '7 DAYS', '14days': '14 DAYS', '30days': '30 DAYS' };
  doc.text(timeline[inspection.complianceTimeline] || 'N/A', margin + 35, y);
  y += 12;

  // Signatures
  if (y > 230) { doc.addPage(); addPageHeader(doc, pageWidth); y = 35; }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');
  doc.text("INSPECTOR'S DECLARATION", margin + 2, y);
  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('I certify that this inspection was conducted in accordance with Lagos State Fire Safety Regulations.', margin, y);
  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Inspector Name:', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(inspection.inspectorName || '', margin + 25, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature:', pageWidth / 2, y);
  doc.setFont('helvetica', 'italic');
  doc.text(inspection.inspectorSignatureText || '_________________', pageWidth / 2 + 18, y);
  y += 10;

  doc.save(`LSFRS_Inspection_${inspection.facilityName?.replace(/\s/g, '_')}.pdf`);
};

export const generateCertificatePDF = (certificate, inspection, station) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  // Border
  doc.setDrawColor(204, 0, 0);
  doc.setLineWidth(2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
  doc.setDrawColor(255, 179, 0);
  doc.setLineWidth(0.5);
  doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Header
  doc.setFillColor(204, 0, 0);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('LAGOS STATE FIRE AND RESCUE SERVICE', pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text('FIRE PREVENTION DEPARTMENT', pageWidth / 2, 23, { align: 'center' });
  doc.setFontSize(9);
  doc.text('Lagos State Government', pageWidth / 2, 31, { align: 'center' });

  doc.setTextColor(0, 0, 0);

  // Certificate number
  doc.setFillColor(255, 179, 0);
  doc.rect(margin, 46, pageWidth - margin * 2, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(100, 50, 0);
  doc.text(`CERTIFICATE NUMBER: ${certificate.certificateNumber}`, pageWidth / 2, 52, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  let y = 65;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(204, 0, 0);
  doc.text('FIRE SAFETY CERTIFICATE', pageWidth / 2, y, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Issued under the Lagos State Fire Safety Law, 2024', pageWidth / 2, y, { align: 'center' });
  y += 14;

  // Body text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const bodyText = `This is to certify that the premises described herein has been duly inspected by officers of the Lagos State Fire and Rescue Service (LSFRS) and has been found to comply with the requirements of the Lagos State Fire Safety Regulations.`;
  const wrapped = doc.splitTextToSize(bodyText, pageWidth - margin * 2 - 10);
  doc.text(wrapped, pageWidth / 2, y, { align: 'center' });
  y += wrapped.length * 6 + 10;

  // Details table
  autoTable(doc, {
    startY: y,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 55, fillColor: [245, 245, 245] }, 1: { cellWidth: 115 } },
    body: [
      ['Name of Facility', certificate.facilityName || inspection?.facilityName || ''],
      ['Address', certificate.facilityAddress || inspection?.address || ''],
      ['Fire Station', station?.name || 'N/A'],
      ['Date of Inspection', inspection?.dateOfInspection || 'N/A'],
      ['Risk Classification', (inspection?.riskClassification || 'N/A').toUpperCase()],
      ['Date Issued', new Date(certificate.issuedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
      ['Valid Until', new Date(certificate.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })],
    ],
  });

  y = doc.lastAutoTable.finalY + 16;

  // Sign area
  const sigX = pageWidth - margin - 70;
  doc.setDrawColor(0);
  doc.line(sigX, y + 28, sigX + 70, y + 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Director, LSFRS', sigX + 35, y + 34, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Lagos State Fire and Rescue Service', sigX + 35, y + 40, { align: 'center' });

  doc.save(`LSFRS_Certificate_${certificate.certificateNumber?.replace(/\//g, '-')}.pdf`);
};
