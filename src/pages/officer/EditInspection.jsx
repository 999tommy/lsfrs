import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LS_KEYS, setStorage } from '../../utils/localStorage';
import { logActivity } from '../../utils/logger';
import { Button } from '../../components/ui/Button';
import { Card, CardBody } from '../../components/ui/Card';
import { Step1General } from './form-steps/Step1General';
import { Step2Checklist } from './form-steps/Step2Checklist';
import { Step3Conclusion } from './form-steps/Step3Conclusion';
import toast from 'react-hot-toast';

export const EditInspection = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { data, refreshData } = useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const inspection = data.inspections.find(i => i.id === id);

  const methods = useForm({ defaultValues: inspection || {} });

  if (!inspection) return <div className="p-8 text-center text-gray-500">Inspection not found.</div>;
  if (inspection.status !== 'rejected') {
    navigate(`/officer/inspection/${id}`);
    return null;
  }

  const onSubmit = (formData) => {
    if (step < 3) { setStep(step + 1); return; }

    const updatedInspections = data.inspections.map(i => {
      if (i.id === id) {
        return {
          ...i,
          ...formData,
          status: 'awaiting_approval',
          rejectionReason: null,
          amountPaid: i.amountPaid,
          updatedAt: new Date().toISOString(),
        };
      }
      return i;
    });

    setStorage(LS_KEYS.INSPECTIONS, updatedInspections);
    logActivity('inspection_resubmitted', currentUser, `Resubmitted inspection for ${inspection.facilityName}`);
    refreshData();
    toast.success('Inspection resubmitted for approval!');
    navigate(`/officer/inspection/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
        <p className="text-sm font-medium text-yellow-800">
          ✏️ You are editing a rejected inspection for <strong>{inspection.facilityName}</strong>. Address the issues and resubmit.
        </p>
        <p className="text-xs text-yellow-700 mt-1">Rejection reason: {inspection.rejectionReason}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <div className={`h-2 rounded-l flex-1 ${step >= 1 ? 'bg-lsfrs-red' : 'bg-gray-200'}`}></div>
          <div className={`h-2 flex-1 ${step >= 2 ? 'bg-lsfrs-red' : 'bg-gray-200'}`}></div>
          <div className={`h-2 rounded-r flex-1 ${step >= 3 ? 'bg-lsfrs-red' : 'bg-gray-200'}`}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>General Info</span><span>Checklist</span><span>Conclusion</span>
        </div>
      </div>

      <Card>
        <CardBody>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {step === 1 && <Step1General />}
              {step === 2 && <Step2Checklist />}
              {step === 3 && <Step3Conclusion />}
              <div className="mt-8 pt-6 border-t flex justify-between">
                {step > 1 ? (
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                ) : <div />}
                <Button type="submit">{step === 3 ? 'Resubmit for Approval' : 'Next Step'}</Button>
              </div>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
};
