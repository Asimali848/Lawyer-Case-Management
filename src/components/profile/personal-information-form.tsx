import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUpdateProfileMutation } from "@/store/services/auth";

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
  onSave?: (data: { firstName: string; lastName: string; email: string }) => void;
}

const PersonalInformationForm = ({ initialData, onSave }: PersonalInformationFormProps) => {
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
  const [savedData, setSavedData] = useState(initialData ? { ...emptyForm, ...initialData } : null);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const isDataSaved = savedData !== null;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        firm_name: formData.firmName,
        street_address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipCode,
        website: formData.website,
      }).unwrap();

      const saved = { ...formData };
      setSavedData(saved);
      onSave?.({
        firstName: saved.firstName,
        lastName: saved.lastName,
        email: saved.email,
      });
      toast.success("Profile saved successfully!");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to save profile. Please try again.");
    }
  };

  const handleUpdate = async () => {
    try {
      await updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phoneNumber,
        firm_name: formData.firmName,
        street_address: formData.streetAddress,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipCode,
        website: formData.website,
      }).unwrap();

      const saved = { ...formData };
      setSavedData(saved);
      onSave?.({
        firstName: saved.firstName,
        lastName: saved.lastName,
        email: saved.email,
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error?.data?.detail || "Failed to update profile. Please try again.");
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
        <CardTitle className="font-bold text-xl">Personal Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="font-medium text-sm">First Name</label>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">Last Name</label>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="font-medium text-sm">Email</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email address"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="font-medium text-sm">Firm Name</label>
            <Input
              value={formData.firmName}
              onChange={(e) => handleInputChange("firmName", e.target.value)}
              placeholder="Enter your firm name"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="font-medium text-sm">Street Address</label>
            <Input
              value={formData.streetAddress}
              onChange={(e) => handleInputChange("streetAddress", e.target.value)}
              placeholder="Enter your street address"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">City</label>
            <Input
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Enter your city"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">State</label>
            <Input
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="Enter your state"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">Zip Code</label>
            <Input
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              placeholder="Enter your zip code"
            />
          </div>
          <div className="space-y-2">
            <label className="font-medium text-sm">Phone Number</label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="font-medium text-sm">Website</label>
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
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          )}
          <Button onClick={isDataSaved ? handleUpdate : handleSave} disabled={isSaving} className="min-w-24">
            {isSaving ? "Saving..." : isDataSaved ? "Update" : "Save"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInformationForm;
