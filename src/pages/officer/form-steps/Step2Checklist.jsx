import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

const ITEMS = [
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

export const Step2Checklist = () => {
  const { register } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Inspection Checklist</h3>
        <p className="text-sm text-gray-500 mb-4">Evaluate the following items and select the appropriate status.</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse border border-gray-200">
            <thead className="bg-gray-100 uppercase text-xs text-gray-700">
              <tr>
                <th className="border p-2">SN</th>
                <th className="border p-2 min-w-[200px]">Item</th>
                <th className="border p-2">Status</th>
                <th className="border p-2 min-w-[200px]">Remark</th>
              </tr>
            </thead>
            <tbody>
              {ITEMS.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 font-medium text-gray-700">{item}</td>
                  <td className="border p-2">
                    <select 
                      {...register(`checklistItems.${index}.status`)}
                      className="w-full px-2 py-1 border rounded text-sm bg-white"
                    >
                      <option value="">-- Select --</option>
                      <option value="Available">Available</option>
                      <option value="Not Available">Not Available</option>
                      <option value="Not Applicable">Not Applicable</option>
                      <option value="Adequate">Adequate</option>
                      <option value="Not Adequate">Not Adequate</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <input 
                      {...register(`checklistItems.${index}.remark`)}
                      type="text"
                      className="w-full px-2 py-1 border rounded text-sm"
                      placeholder="Optional remark..."
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 pb-2 mb-4">24 (B). Fire Safety Certificate Compliance</h3>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2">
            <input 
              {...register('fireComplianceStatus', { required: 'Required' })} 
              type="radio" 
              value="complied" 
              className="text-lsfrs-red focus:ring-lsfrs-red"
            />
            <span className="text-gray-700">Complied with LSFRS Law 2024</span>
          </label>
          <label className="flex items-center space-x-2">
            <input 
              {...register('fireComplianceStatus', { required: 'Required' })} 
              type="radio" 
              value="non_complied" 
              className="text-lsfrs-red focus:ring-lsfrs-red"
            />
            <span className="text-gray-700">Non-Complied</span>
          </label>
        </div>
      </div>
    </div>
  );
};
