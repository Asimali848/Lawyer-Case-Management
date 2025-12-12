import { useState } from "react";
import ChangePasswordModal from "@/components/profile/change-password-modal";
import PersonalInformationForm from "@/components/profile/personal-information-form";
import UserProfileCard from "@/components/profile/user-profile-card";
import AccountDetailsCard from "@/components/profile/account-details-card";
import { useGetCurrentUserQuery } from "@/store/services/auth";
import Loader from "@/components/loader";

const Profile = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const { data: userData, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Failed to load profile data</p>
      </div>
    );
  }

  // Split name into first and last name
  const nameParts = (userData.name || "").split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const profileData = {
    firstName: userData.first_name || firstName,
    lastName: userData.last_name || lastName,
    email: userData.email,
    phoneNumber: userData.phone_number || "",
    firmName: userData.firm_name || "",
    streetAddress: userData.street_address || "",
    city: userData.city || "",
    state: userData.state || "",
    zipCode: userData.zipcode || "",
    website: userData.website || "",
  };

  const memberSince = userData.created_at
    ? new Date(userData.created_at).toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  return (
    <div className="h-full w-full md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-6">
            <UserProfileCard
              firstName={profileData.firstName}
              lastName={profileData.lastName}
              email={profileData.email}
            />
            <AccountDetailsCard
              memberSince={memberSince}
              onPasswordChange={() => setIsChangePasswordOpen(true)}
            />
          </div>
          <PersonalInformationForm
            initialData={{
              firstName: profileData.firstName,
              lastName: profileData.lastName,
              email: profileData.email,
              phoneNumber: profileData.phoneNumber,
              firmName: profileData.firmName,
              streetAddress: profileData.streetAddress,
              city: profileData.city,
              state: profileData.state,
              zipCode: profileData.zipCode,
              website: profileData.website,
            }}
          />
        </div>
      </div>
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onOpenChange={setIsChangePasswordOpen}
      />
    </div>
  );
};

export default Profile;
