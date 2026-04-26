import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { LS_KEYS, setStorage } from '../../utils/localStorage';
import { logActivity } from '../../utils/logger';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Step1General } from './form-steps/Step1General';
import { Step2Checklist } from './form-steps/Step2Checklist';
import { Step3Conclusion } from './form-steps/Step3Conclusion';
import toast from 'react-hot-toast';

export const NewInspection = () => {
  const [step, setStep] = useState(1);
  const { currentUser } = useAuth();
  const { data, refreshData } = useData();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      cacNumber: '',
      adminCharge: 0,
      amountCharged: 0,
      checklistItems: Array(23).fill({ status: '', remark: '' }),
      housekeeping: {
        flammable: '', electrical: '', gas: '', waste: ''
      },
      fireComplianceStatus: '',
      riskClassification: 'low',
      keyObservations: Array(5).fill(''),
      recommendations: Array(5).fill('')
    }
  });

  const onSubmit = (formData) => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Final submit
    const newInspection = {
      ...formData,
      id: uuidv4(),
      officerId: currentUser.id,
      stationId: currentUser.stationId,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedInspections = [...data.inspections, newInspection];
    setStorage(LS_KEYS.INSPECTIONS, updatedInspections);
    
    logActivity('inspection_created', currentUser, `Created inspection for ${newInspection.facilityName}`);
    
    refreshData();
    toast.success('Inspection submitted successfully! Waiting for payment.');
    navigate(`/officer/inspection/${newInspection.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">New Fire Safety Inspection</h2>
        <div className="flex items-center mt-4">
          <div className="flex relative w-full items-center">
            <div className={`h-2 rounded-l flex-1 ${step >= 1 ? 'bg-lsfrs-red' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 ${step >= 2 ? 'bg-lsfrs-red' : 'bg-gray-200'}`}></div>
            <div className={`h-2 rounded-r flex-1 ${step >= 3 ? 'bg-lsfrs-red' : 'bg-gray-200'}`}></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
          <span>General Info</span>
          <span>Checklist</span>
          <span>Conclusion</span>
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
                  <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                <Button type="submit">
                  {step === 3 ? 'Submit Inspection' : 'Next Step'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
};
