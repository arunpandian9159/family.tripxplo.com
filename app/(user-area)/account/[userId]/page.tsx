"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { UserProfile } from "@/app/types";
import { updateProfile } from "@/app/utils/api/getProfile";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Pencil, ArrowLeft, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, parseISO, isValid } from "date-fns";

const Profile = () => {
  const { user, isAuthenticated, isLoading, refetch } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "",
    dob: "",
    email: "",
    mobileNo: "",
    pinCode: "",
    profileImg: "",
    gender: "",
  });

  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMobileNo, setEditMobileNo] = useState("");
  const [editPinCode, setEditPinCode] = useState("");
  const [editDob, setEditDob] = useState<string>("");
  const [editGender, setEditGender] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      const userData = user as any;
      setUserProfile({
        fullName: userData.fullName || userData.name || "",
        dob: userData.dob || "",
        email: userData.email || "",
        mobileNo: userData.mobileNo || userData.phone || "",
        pinCode: userData.pinCode || "",
        profileImg: userData.profileImg || userData.profileImage || "",
        gender: userData.gender || "",
      });
      setEditFullName(userData.fullName || userData.name || "");
      setEditEmail(userData.email || "");
      setEditMobileNo(String(userData.mobileNo || userData.phone || ""));
      setEditPinCode(userData.pinCode || "");
      setEditDob(userData.dob || "");
      setEditGender(userData.gender || "");
    }
  }, [user]);

  const handleFieldChange =
    (setEditField: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setEditField(event.target.value);
    };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditDob(event.target.value);
  };

  const handleUpdateField = async (field: keyof UserProfile, value: string) => {
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const updatedProfile = { ...userProfile, [field]: value };
      const response = await updateProfile(updatedProfile);
      if (response?.result) {
        toast.success("Profile updated successfully");
        setUserProfile(updatedProfile);
        // Refetch user data to update across app
        refetch?.();
      } else {
        toast.error("Error updating profile");
      }
    } catch (error) {
      toast.error("Error updating profile");
      console.error(`Error updating ${field}:`, error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateDate = async () => {
    if (editDob) {
      await handleUpdateField("dob", editDob);
    }
  };

  // Safely format date
  const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return "Not set";
    try {
      const date = parseISO(dateStr);
      if (isValid(date)) {
        return format(date, "PPP");
      }
      return dateStr;
    } catch {
      return dateStr || "Not set";
    }
  };

  const formattedDate = formatDate(userProfile.dob);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 pt-6 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.push("/account")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Account</span>
          </button>
          <h1 className="text-2xl font-bold text-white">
            Personal Information
          </h1>
          <p className="text-emerald-100">Manage your profile details</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {user && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:p-8 p-4">
            {/* Profile Header */}
            <div className="flex flex-col items-center space-y-6 lg:space-y-8 mb-8">
              <div className="relative lg:w-32 lg:h-32 w-24 h-24">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {(user as any).profileImg || (user as any).profileImage ? (
                      <Image
                        unoptimized
                        src={
                          (user as any).profileImg ||
                          (user as any).profileImage ||
                          ""
                        }
                        className="object-cover"
                        fill
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <User className="w-10 h-10 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-900">
                  {userProfile.fullName || "Your Name"}
                </h2>
                <p className="text-slate-500 text-sm">{userProfile.email}</p>
              </div>
              <hr className="border-t w-full border-grey-200" />
            </div>

            {/* Profile Fields Container */}
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Name Field */}
              <div className="bg-gray-50 rounded-xl p-6 ">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-slate-600 text-sm lg:text-base">
                      Name
                    </h1>
                    <h1 className="text-[#1EC089] drop-shadow-black drop-shadow-sm text-xl lg:text-2xl font-medium">
                      {userProfile.fullName}
                    </h1>
                  </div>
                  <Drawer>
                    <DrawerTrigger>
                      <div className="p-2 lg:p-3 rounded-full bg-[#1EC089] flex items-center justify-center text-white">
                        <Pencil className="lg:w-4 lg:h-4 w-3 h-3" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                          Edit Name
                        </h2>
                        <input
                          type="text"
                          value={editFullName}
                          onChange={handleFieldChange(setEditFullName)}
                          className="border p-3 w-full mb-4 rounded-lg"
                          placeholder="Enter new name"
                        />
                        <button
                          onClick={() =>
                            handleUpdateField("fullName", editFullName)
                          }
                          disabled={isUpdating}
                          className="bg-[#1EC089] text-white px-6 py-3 rounded-full w-full lg:text-lg disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Update Name"}
                        </button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              {/* Email Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-slate-600 text-sm lg:text-base">
                      Email
                    </h1>
                    <h1 className="text-[#1EC089] drop-shadow-black drop-shadow-sm text-xl lg:text-2xl font-medium truncate max-w-[200px] lg:max-w-[300px]">
                      {userProfile.email}
                    </h1>
                  </div>
                  <Drawer>
                    <DrawerTrigger>
                      <div className="p-2 lg:p-3 rounded-full bg-[#1EC089] flex items-center justify-center text-white">
                        <Pencil className="lg:w-4 lg:h-4 w-3 h-3" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                          Edit Email
                        </h2>
                        <input
                          type="email"
                          value={editEmail}
                          onChange={handleFieldChange(setEditEmail)}
                          className="border p-3 w-full mb-4 rounded-lg"
                          placeholder="Enter new email"
                        />
                        <button
                          onClick={() => handleUpdateField("email", editEmail)}
                          disabled={isUpdating}
                          className="bg-[#1EC089] text-white px-6 py-3 rounded-full w-full lg:text-lg disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Update Email"}
                        </button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              {/* Mobile Number Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-slate-600 text-sm lg:text-base">
                      Mobile Number
                    </h1>
                    <h1 className="text-[#1EC089] drop-shadow-black drop-shadow-sm text-xl lg:text-2xl font-medium">
                      {userProfile.mobileNo}
                    </h1>
                  </div>
                  <Drawer>
                    <DrawerTrigger>
                      <div className="p-2 lg:p-3 rounded-full bg-[#1EC089] flex items-center justify-center text-white">
                        <Pencil className="lg:w-4 lg:h-4 w-3 h-3" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                          Edit Mobile Number
                        </h2>
                        <input
                          type="text"
                          value={editMobileNo}
                          onChange={handleFieldChange(setEditMobileNo)}
                          className="border p-3 w-full mb-4 rounded-lg"
                          placeholder="Enter new mobile number"
                        />
                        <button
                          onClick={() =>
                            handleUpdateField("mobileNo", editMobileNo)
                          }
                          disabled={isUpdating}
                          className="bg-[#1EC089] text-white px-6 py-3 rounded-full w-full lg:text-lg disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Update Mobile Number"}
                        </button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              {/* Pin Code Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-slate-600 text-sm lg:text-base">
                      Pin Code
                    </h1>
                    <h1 className="text-[#1EC089] drop-shadow-black drop-shadow-sm text-xl lg:text-2xl font-medium">
                      {userProfile.pinCode}
                    </h1>
                  </div>
                  <Drawer>
                    <DrawerTrigger>
                      <div className="p-2 lg:p-3 rounded-full bg-[#1EC089] flex items-center justify-center text-white">
                        <Pencil className="lg:w-4 lg:h-4 w-3 h-3" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                          Edit Pin Code
                        </h2>
                        <input
                          type="text"
                          value={editPinCode}
                          onChange={handleFieldChange(setEditPinCode)}
                          className="border p-3 w-full mb-4 rounded-lg"
                          placeholder="Enter new pin code"
                        />
                        <button
                          onClick={() =>
                            handleUpdateField("pinCode", editPinCode)
                          }
                          disabled={isUpdating}
                          className="bg-[#1EC089] text-white px-6 py-3 rounded-full w-full lg:text-lg disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Update Pin Code"}
                        </button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>

              {/* Date of Birth Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-slate-600 text-sm lg:text-base">
                      Date of Birth
                    </h1>
                    <h1 className="text-[#1EC089] drop-shadow-black drop-shadow-sm text-xl lg:text-2xl font-medium">
                      {formattedDate}
                    </h1>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="p-2 lg:p-3 rounded-full bg-[#1EC089] flex items-center justify-center text-white">
                        <Pencil className="lg:w-4 lg:h-4 w-3 h-3" />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                          Edit Date of Birth
                        </h2>
                        <input
                          type="date"
                          value={editDob}
                          onChange={handleDateChange}
                          className="border p-3 w-full mb-4 rounded-lg"
                        />
                        <AlertDialogAction
                          onClick={handleUpdateDate}
                          className="bg-[#1EC089] text-white px-6 py-3 rounded-full w-full lg:text-lg"
                          disabled={isUpdating}
                        >
                          {isUpdating ? "Updating..." : "Update Date of Birth"}
                        </AlertDialogAction>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Gender Field */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-slate-600 text-sm lg:text-base">
                      Gender
                    </h1>
                    <h1 className="text-[#1EC089] drop-shadow-black drop-shadow-sm text-xl lg:text-2xl font-medium capitalize">
                      {userProfile.gender || "Not set"}
                    </h1>
                  </div>
                  <Drawer>
                    <DrawerTrigger>
                      <div className="p-2 lg:p-3 rounded-full bg-[#1EC089] flex items-center justify-center text-white">
                        <Pencil className="lg:w-4 lg:h-4 w-3 h-3" />
                      </div>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                          Edit Gender
                        </h2>
                        <select
                          value={editGender}
                          onChange={handleFieldChange(setEditGender)}
                          className="border p-3 w-full mb-4 rounded-lg bg-white"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <button
                          onClick={() =>
                            handleUpdateField("gender", editGender)
                          }
                          disabled={isUpdating}
                          className="bg-[#1EC089] text-white px-6 py-3 rounded-full w-full lg:text-lg disabled:opacity-50"
                        >
                          {isUpdating ? "Updating..." : "Update Gender"}
                        </button>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
