import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PersonalInformationFormProps {
  initialData?: {
    firstName: string;
    lastName: string;
    email: string;
    firmName?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    website?: string;
  };
  onSave?: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
}

const PersonalInformationForm = ({
  initialData,
  onSave,
}: PersonalInformationFormProps) => {
  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    firmName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    website: "",
  };

  const [formData, setFormData] = useState({
    ...emptyForm,
    ...initialData,
  });
  const [savedData, setSavedData] = useState(
    initialData ? { ...emptyForm, ...initialData } : null
  );
  const [isSaving, setIsSaving] = useState(false);
  const isDataSaved = savedData !== null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call to save profile data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const saved = { ...formData };
      setSavedData(saved);
      onSave?.({
        firstName: saved.firstName,
        lastName: saved.lastName,
        email: saved.email,
      });
      toast.success("Profile saved successfully!");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call to update profile data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const saved = { ...formData };
      setSavedData(saved);
      onSave?.({
        firstName: saved.firstName,
        lastName: saved.lastName,
        email: saved.email,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (savedData) {
      setFormData({ ...savedData });
      toast.info("Changes cancelled");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Firm Name</label>
            <Input
              value={formData.firmName}
              onChange={(e) => handleInputChange("firmName", e.target.value)}
              placeholder="Enter your firm name"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Street Address</label>
            <Input
              value={formData.streetAddress}
              onChange={(e) =>
                handleInputChange("streetAddress", e.target.value)
              }
              placeholder="Enter your street address"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">City</label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Enter your city"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">State</label>
            <Input
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="Enter your state"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Zip Code</label>
            <Input
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              placeholder="Enter your zip code"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Website</label>
            <Input
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="Enter your website URL"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {isDataSaved && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={isDataSaved ? handleUpdate : handleSave}
            disabled={isSaving}
            className="min-w-24"
          >
            {isSaving ? "Saving..." : isDataSaved ? "Update" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationForm;
