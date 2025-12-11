import { useState } from "react";
import ChangePasswordModal from "@/components/profile/change-password-modal";
import PersonalInformationForm from "@/components/profile/personal-information-form";
import UserProfileCard from "@/components/profile/user-profile-card";
import AccountDetailsCard from "@/components/profile/account-details-card";

const Profile = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [savedProfileData, setSavedProfileData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);

  const userData = {
    memberSince: "08-25-2025",
  };

  // Get profile data from saved state or use empty values
  const profileData = savedProfileData || {
    firstName: "",
    lastName: "",
    email: "",
  };

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
              memberSince={userData.memberSince}
              onPasswordChange={() => setIsChangePasswordOpen(true)}
            />
          </div>
          <PersonalInformationForm
            initialData={savedProfileData ? undefined : undefined}
            onSave={(data) => {
              setSavedProfileData({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
              });
            }}
          />
        </div>
      </div>
      <ChangePasswordModal open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen} />
    </div>
  );
};

export default Profile;
