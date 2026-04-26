import React from 'react';
import { useFormContext } from 'react-hook-form';

export const Step3Conclusion = () => {
  const { register, watch } = useFormContext();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Risk Classification */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Risk Classification</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'low', label: 'Low Risk', color: 'border-green-500 text-green-700 peer-checked:bg-green-50' },
            { value: 'medium', label: 'Medium Risk', color: 'border-yellow-500 text-yellow-700 peer-checked:bg-yellow-50' },
            { value: 'high', label: 'High Risk', color: 'border-orange-500 text-orange-700 peer-checked:bg-orange-50' },
            { value: 'extreme', label: 'Extreme Risk', color: 'border-red-600 text-red-700 peer-checked:bg-red-50' },
          ].map(({ value, label, color }) => (
            <label key={value} className="cursor-pointer">
              <input
                {...register('riskClassification')}
                type="radio"
                value={value}
                className="peer sr-only"
              />
              <div className={`border-2 rounded-lg p-3 text-center font-semibold text-sm transition-all peer-checked:ring-2 ${color}`}>
                {label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Key Observations */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Key Observations</h3>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-2 text-sm font-semibold text-gray-500 w-4">{i + 1}.</span>
              <textarea
                {...register(`keyObservations.${i}`)}
                rows="2"
                className="flex-1 px-3 py-2 border rounded-md text-sm resize-none"
                placeholder={`Observation ${i + 1}...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Recommendations & Compliance</h3>
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-2 text-sm font-semibold text-gray-500 w-4">{i + 1}.</span>
              <textarea
                {...register(`recommendations.${i}`)}
                rows="2"
                className="flex-1 px-3 py-2 border rounded-md text-sm resize-none"
                placeholder={`Recommendation ${i + 1}...`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Financial Charges */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Financial Charges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Administrative Charge (₦)</label>
            <input
              {...register('adminCharge')}
              type="number"
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount Charged (₦)</label>
            <input
              {...register('amountCharged')}
              type="number"
              className="w-full px-3 py-2 border rounded-md text-sm"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Compliance Timeline */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Compliance Timeline</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { value: 'immediate', label: 'Immediate' },
            { value: '7days', label: '7 Days' },
            { value: '14days', label: '14 Days' },
            { value: '30days', label: '30 Days' },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center space-x-2 cursor-pointer">
              <input
                {...register('complianceTimeline')}
                type="radio"
                value={value}
                className="text-lsfrs-red focus:ring-lsfrs-red w-4 h-4"
              />
              <span className="text-gray-700 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Inspector Declaration */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Inspector's Declaration</h3>
        <p className="text-sm text-gray-500 italic mb-4">
          I certify that this inspection was conducted in accordance with Lagos State Fire Safety Regulations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Inspector Name *</label>
            <input
              {...register('inspectorName')}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              {...register('inspectorDate')}
              type="date"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Signature (Type your full name)</label>
            <input
              {...register('inspectorSignatureText')}
              className="w-full px-3 py-2 border rounded-md text-sm italic"
              placeholder="Type your name as signature..."
            />
          </div>
        </div>
      </div>

      {/* Occupier Acknowledgement */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Occupier/Owner Acknowledgement</h3>
        <p className="text-sm text-gray-500 italic mb-4">
          I acknowledge receipt of this inspection report and recommendations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupier/Owner Name</label>
            <input
              {...register('occupierName')}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              {...register('occupierDate')}
              type="date"
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Signature (Type name)</label>
            <input
              {...register('occupierSignatureText')}
              className="w-full px-3 py-2 border rounded-md text-sm italic"
              placeholder="Occupier signature..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
