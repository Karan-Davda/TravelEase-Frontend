import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicDetailsStep from './steps/BasicDetailsStep';
import CityItineraryStep from './steps/CityItineraryStep';
import { fetchWithAuth } from '@/utils/apiHelper';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

interface PackageCreationWizardProps {
  isEditMode?: boolean;
  packageId?: string;
}

const PackageCreationWizard = ({ isEditMode = false, packageId }: PackageCreationWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [packageData, setPackageData] = useState<any>({
    PackageName: '',
    Description: '',
    Price: 0,
    Discount: 0,
    RegistrationCap: 1,
    IsTourGuide: false,
    Status: 'Draft',
    SourceCityID: null,
    DestinationCityID: null,
    PackageTrans: [],
    PhotoURL: null,
  });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditMode && packageId) {
      const fetchPackageDetails = async () => {
        try {
          const packages = await fetchWithAuth("http://localhost:3000/api/partners/packages");
          const packageToEdit = packages.find((pkg: any) => pkg.PackageID.toString() === packageId);

          if (packageToEdit) {
            setPackageData(packageToEdit);
          } else {
            toast({
              title: "Error",
              description: "Package not found.",
              variant: "destructive",
            });
            navigate('/agency-dashboard');
          }
        } catch (error) {
          console.error("Failed to fetch package details:", error);
          toast({
            title: "Error",
            description: "Failed to fetch package details.",
            variant: "destructive",
          });
          navigate('/agency-dashboard');
        }
      };

      fetchPackageDetails();
    }
  }, [isEditMode, packageId, navigate, toast]);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setPackageData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      let url = "http://localhost:3000/api/partners/packages";
      let method = 'POST';

      if (isEditMode && packageId) {
        url = `http://localhost:3000/api/partners/packages/${packageId}`;
        method = 'PUT';
      }

      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      toast({
        title: "Success",
        description: `Package ${isEditMode ? 'updated' : 'created'} successfully.`,
      });
      navigate('/agency-dashboard');
    } catch (error) {
      console.error("Failed to save package:", error);
      toast({
        title: "Error",
        description: "Failed to save package. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicDetailsStep
            packageData={packageData}
            handleChange={handleChange}
            nextStep={nextStep}
            isEditMode={isEditMode}
          />
        );
      case 2:
        return (
          <CityItineraryStep
            packageData={packageData}
            setPackageData={setPackageData}
            prevStep={prevStep}
            isEditMode={isEditMode}
          />
        );
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <div>
      {renderStepContent()}
      <div className="mt-6 flex justify-between">
        {currentStep > 1 && (
          <Button variant="secondary" onClick={prevStep}>
            Previous
          </Button>
        )}
        {currentStep === 2 ? (
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Saving...' : (isEditMode ? 'Update Package' : 'Create Package')}
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default PackageCreationWizard;
