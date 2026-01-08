import { userApi } from "@/lib/api-client";
import { UserProfile } from "@/app/types";

export const getProfile = async () => {
  try {
    const response = await userApi.getProfile();

    if (response.success && response.data) {
      // Return in a format compatible with existing code
      return {
        result: response.data,
      };
    }

    return Promise.reject("Failed to fetch profile");
  } catch (error) {
    return Promise.reject("error");
  }
};

export const updateProfile = async (values: UserProfile) => {
  try {
    const response = await userApi.updateProfile(
      values as unknown as Record<string, unknown>,
    );

    if (response.success && response.data) {
      return {
        result: response.data,
      };
    }

    return Promise.reject("Failed to update profile");
  } catch (error) {
    return Promise.reject("error");
  }
};
