import { CircleUserRound } from "lucide-react";

const Profile = () => {
  return (
    <div className="h-full w-full">
      <div className="mx-auto mt-16 flex h-full w-1/2 flex-col items-center justify-center gap-2 rounded-xl bg-primary p-5">
        <CircleUserRound className="size-10" />
        <h1 className="font-bold text-3xl">Profile</h1>
        <p className="text-2xl">Coming Soon</p>
      </div>
    </div>
  );
};

export default Profile;
