import { User } from "lucide-react";
import React from "react";

const MyProfile = () => {
  return (
    <div className="w-full cursor-pointer h-16 border rounded-lg flex space-x-6 items-center p-2">
      <User className="text-[#ff9080]" />
      <h1 className="text-slate-500">My Profile</h1>
    </div>
  );
};

export default MyProfile;
