import { useFormContext } from 'react-hook-form';
import { Calendar, Clock } from 'lucide-react';

export const Step1General = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const occupancyType = watch('occupancyType');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">1. General Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Name of Facility *</label>
            <input 
              {...register('facilityName')} 
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g. Lagos City Mall"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Address *</label>
            <textarea 
              {...register('address')} 
              className="w-full px-3 py-2 border rounded-md"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Type of Occupancy *</label>
            <select 
              {...register('occupancyType')} 
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select an option</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="others">Others</option>
            </select>
          </div>

          {occupancyType === 'others' && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Specify Occupancy *</label>
              <input 
                {...register('occupancyTypeOther')} 
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          )}

          <div className={occupancyType === 'others' ? 'md:col-span-2' : ''}>
            <label className="block text-gray-700 font-medium mb-1">Owner/Occupier/Manager's Name *</label>
            <input 
              {...register('ownerName')} 
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone Number(s) *</label>
            <input 
              {...register('phoneNumbers')} 
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Comma separated if multiple"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input 
              {...register('email')} 
              type="email"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Tax Payer's ID</label>
            <input 
              {...register('taxPayerId')} 
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">CAC Number</label>
            <input 
              {...register('cacNumber')} 
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g. RC 1234567"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4 mt-8">2. Inspection Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-gray-700 font-medium">Date of Inspection *</label>
              <button 
                type="button"
                onClick={() => setValue('dateOfInspection', new Date().toISOString().split('T')[0])}
                className="text-xs text-lsfrs-red hover:underline flex items-center gap-1 font-semibold"
              >
                <Calendar size={14} /> Today
              </button>
            </div>
            <input 
              {...register('dateOfInspection')} 
              type="date"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-100 outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-gray-700 font-medium">Time of Arrival</label>
              <button 
                type="button"
                onClick={() => setValue('timeOfArrival', new Date().toTimeString().split(' ')[0].substring(0, 5))}
                className="text-xs text-lsfrs-red hover:underline flex items-center gap-1 font-semibold"
              >
                <Clock size={14} /> Now
              </button>
            </div>
            <input 
              {...register('timeOfArrival')} 
              type="time"
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-100 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-1">Inspection Type *</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['routine', 'fire_safety', 'pre_occupancy', 'post_incidence', 'compliance', 'special'].map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input 
                    {...register('inspectionType')} 
                    type="radio" 
                    value={type} 
                    className="text-lsfrs-red focus:ring-lsfrs-red"
                  />
                  <span className="capitalize text-gray-700">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Inspection Team Leader *</label>
            <input 
              {...register('teamLeader')} 
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of Inspectors *</label>
            <input 
              {...register('numberOfInspectors', { required: 'Required', min: 1 })} 
              type="number"
              min="1"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
