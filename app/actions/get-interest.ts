import { buildApiUrl } from "@/app/utils/constants/apiUrls";

export async function getInterest() {
  const response = await fetch(buildApiUrl("interests"));
  const json = await response.json();

  if (json.success && json.data?.interests) {
    return json.data.interests;
  }

  return json.result || [];
}
