"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Form, FormField, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface UserData {
  email: string;
  [key: string]: any; 
}

const VerifyOtp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("registeredUser");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    }
  }, []);

  const form = useForm({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: { otp: string }) => {
    if (!userData) {
      toast.error("User data is not available");
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest('auth/otp/verify', {
        method: 'POST',
        body: {
          ...userData,
          otp: data.otp,
        },
      });
      
      if (response.success) {
      toast.success('OTP verification Successful');
        localStorage.removeItem("registeredUser");
      router.push('/');
      } else {
        toast.error(response.message || 'Verification failed');
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return <p>Loading...</p>; // Or any loading indicator
  }

  return (
    <div className="px-5 pt-5">
      <div className="w-full space-y-2">
        <div className="">
          <h2 className="font-semibold text-lg text-[#FF5F5F]">OTP verification</h2>
          <p className="text-sm mt-3">
            Enter the 6-digit code sent to mailid {userData?.email}
          </p>
        </div>
        <Form {...form}>
          <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormControl>
                  <>
                    <input
                      className="w-full mt-5 border border-gray-300 rounded px-3 py-2"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      {...field}
                    />
                    <FormMessage />
                  </>
                </FormControl>
              )}
            />
            <div className="bottom-0 left-0 fixed w-full px-5 py-2 mt-6">
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyOtp;
