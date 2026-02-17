import { UserProfile } from "@/types";

const PROFILE_KEY = "bobby_user_profile";

const DEFAULT_PROFILE: UserProfile = {
  allergies: [],
  restrictions: [],
  preferences: [],
};

export function getUserProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return DEFAULT_PROFILE;
  try {
    return JSON.parse(stored) as UserProfile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
